using UnityEngine;

public class Enemy : MonoBehaviour, IDamageable
{
    [Header("Vitals")]
    [SerializeField] private float maxHealth = 50f;
    [SerializeField] private float armor = 0f;
    [SerializeField] private bool targetable = true;
    [SerializeField] private bool destroyOnDeath = true;

    [Header("Movement")]
    [SerializeField] private float moveSpeed = 2f;
    [SerializeField] private float waypointSnapDistance = 0.1f;
    [SerializeField] private bool destroyAtPathEnd = true;
    [SerializeField] private int lifeDamageAtPathEnd = 1;

    [Header("Pathing")]
    [SerializeField] private Path2D primaryPath;
    [SerializeField] private Path2D shortcutPath;
    [SerializeField] private int shortcutEntryIndex = 0;
    [SerializeField] private int shortcutExitIndex = 0;

    [Header("Offense")]
    [SerializeField] private float attackSpeed = 1f; // attacks per second
    [SerializeField] private float range = 1.5f;

    [Header("Targeting")]
    [SerializeField] private Transform target;

    private float _health;
    private float _cooldown;
    private int _currentIndex;
    private Path2D _currentPath;
    private bool _pendingShortcut;
    private bool _didReachPathEnd;

    public bool IsAlive => _health > 0f;
    public bool IsTargetable => targetable;
    public Transform AimPoint => transform;

    public float Health => _health;
    public float MaxHealth => maxHealth;
    public float Armor => armor;
    public float MoveSpeed => moveSpeed;
    public float AttackSpeed => attackSpeed;
    public float Range => range;

    private void Awake()
    {
        _health = Mathf.Max(1f, maxHealth);
    }

    private void OnEnable()
    {
        UpdateTargetableRegistration();
        PathManager.RegisterEnemy(this);
        _currentPath = primaryPath;
        _currentIndex = 0;
        _pendingShortcut = false;
        _didReachPathEnd = false;
    }

    private void OnDisable()
    {
        TargetableRegistry.UnregisterEnemy(this);
        EnemySpatialIndex.Unregister(this);
        PathManager.UnregisterEnemy(this);
    }

    private void Update()
    {
        if (!IsAlive)
        {
            return;
        }

        if (_cooldown > 0f)
        {
            _cooldown -= Time.deltaTime;
        }

        AcquireNearestTarget();

        FollowPath();
        EnemySpatialIndex.UpdatePosition(this, transform.position);

        if (target == null)
        {
            return;
        }

        if (!IsTargetInRange(target))
        {
            return;
        }

        if (_cooldown > 0f)
        {
            return;
        }

        _cooldown = attackSpeed <= 0f ? 0.1f : 1f / attackSpeed;
        // Attack action placeholder.
    }

    public void SetTarget(Transform newTarget)
    {
        target = newTarget;
    }

    public void SetShortcutActive(bool isActive)
    {
        if (!isActive)
        {
            _pendingShortcut = false;
            return;
        }

        if (_currentPath != primaryPath)
        {
            return;
        }

        if (_currentIndex <= shortcutEntryIndex)
        {
            _pendingShortcut = true;
        }
    }

    public void SetPrimaryPath(Path2D newPrimaryPath)
    {
        primaryPath = newPrimaryPath;
        _currentPath = primaryPath;
        _currentIndex = 0;
        _pendingShortcut = false;
        _didReachPathEnd = false;
    }

    public void SetTargetable(bool isTargetable)
    {
        if (targetable == isTargetable)
        {
            return;
        }

        targetable = isTargetable;
        UpdateTargetableRegistration();
    }

    public void TakeDamage(float amount)
    {
        if (!IsAlive)
        {
            return;
        }

        if (_didReachPathEnd)
        {
            return;
        }

        _health = Mathf.Max(0f, _health - GetMitigatedDamage(amount));

        if (!IsAlive)
        {
            HandleDeath();
        }
    }

    private bool IsTargetInRange(Transform targetTransform)
    {
        Vector2 origin = transform.position;
        Vector2 targetPos = targetTransform.position;
        float sqrRange = range * range;
        return (targetPos - origin).sqrMagnitude <= sqrRange;
    }

    private void AcquireNearestTarget()
    {
        Transform nearest = null;
        float nearestSqr = float.MaxValue;
        Vector3 position = transform.position;

        var candidates = TargetableRegistry.TowerList;
        for (int i = 0; i < candidates.Count; i++)
        {
            IDamageable candidate = candidates[i];
            if (candidate == null || !candidate.IsAlive)
            {
                continue;
            }

            Transform candidateTransform = candidate.AimPoint;
            if (candidateTransform == null)
            {
                continue;
            }
            float sqr = (candidateTransform.position - position).sqrMagnitude;
            if (sqr < nearestSqr)
            {
                nearestSqr = sqr;
                nearest = candidateTransform;
            }
        }

        target = nearest;
    }

    private void FollowPath()
    {
        if (_currentPath == null || _currentPath.Count == 0)
        {
            return;
        }

        if (_pendingShortcut && _currentPath == primaryPath && _currentIndex >= shortcutEntryIndex)
        {
            if (shortcutPath != null && shortcutPath.Count > 0)
            {
                _currentPath = shortcutPath;
                _currentIndex = 0;
            }

            _pendingShortcut = false;
        }

        Transform checkpoint = _currentPath.GetCheckpoint(_currentIndex);
        if (checkpoint == null)
        {
            return;
        }

        Vector3 toCheckpoint = checkpoint.position - transform.position;
        float distance = toCheckpoint.magnitude;
        if (distance <= waypointSnapDistance)
        {
            _currentIndex++;
            if (_currentIndex >= _currentPath.Count)
            {
                if (_currentPath == shortcutPath && primaryPath != null && primaryPath.Count > 0)
                {
                    _currentPath = primaryPath;
                    _currentIndex = Mathf.Clamp(shortcutExitIndex, 0, primaryPath.Count - 1);
                }
                else
                {
                    HandleReachedPathEnd();
                }
            }

            return;
        }

        Vector3 step = toCheckpoint.normalized * moveSpeed * Time.deltaTime;
        transform.position += step;
    }

    private float GetMitigatedDamage(float amount)
    {
        return Mathf.Max(0f, amount - armor);
    }

    private void UpdateTargetableRegistration()
    {
        if (IsTargetable)
        {
            TargetableRegistry.RegisterEnemy(this);
            EnemySpatialIndex.Register(this, transform.position);
        }
        else
        {
            TargetableRegistry.UnregisterEnemy(this);
            EnemySpatialIndex.Unregister(this);
        }
    }

    private void HandleReachedPathEnd()
    {
        if (_didReachPathEnd)
        {
            return;
        }

        _didReachPathEnd = true;

        if (GameLife.Instance != null && lifeDamageAtPathEnd > 0)
        {
            GameLife.Instance.LoseLife(lifeDamageAtPathEnd);
        }

        if (destroyAtPathEnd)
        {
            Destroy(gameObject);
        }
    }

    private void HandleDeath()
    {
        TargetableRegistry.UnregisterEnemy(this);
        EnemySpatialIndex.Unregister(this);
        PathManager.UnregisterEnemy(this);

        if (destroyOnDeath)
        {
            Destroy(gameObject);
        }
    }
}
