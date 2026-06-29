using UnityEngine;

public class Tower : MonoBehaviour, IDamageable
{
    [System.Serializable]
    private class ProjectileSettings
    {
        public float speed = 10f;
        public float maxLifetime = 5f;
        public float hitRadius = 0.2f;
        public float armingDistance = 0.01f;
        public float armingTime = 0.01f;
        public float destinationArrivalDistance = 0.01f;
        public int sortingOrder = 200;
    }

    [Header("Vitals")]
    [SerializeField] private float maxHealth = 100f;
    [SerializeField] private float armor = 0f;
    [SerializeField] private bool targetable = false;

    [Header("Offense")]
    [SerializeField] private bool useAttackSpeed = true;
    [SerializeField] private float attackSpeed = 4f; // shots per second while firing
    [SerializeField] private bool useChargeUpSpeed = false;
    [SerializeField] private float chargeUpSpeed = 1f; // charge cycles per second
    [SerializeField] private int shotsPerCharge = 1;
    [SerializeField] private float damage = 10f;
    [SerializeField] private float range = 6f;
    [SerializeField] private Projectile projectilePrefab;
    [SerializeField] private Transform firePoint;
    [SerializeField] private bool useTowerProjectileSettings = true;
    [SerializeField] private ProjectileSettings projectileSettings = new ProjectileSettings();

    [Header("Targeting")]
    [SerializeField] private Transform target;

    private float _health;
    private float _timeUntilNextShot;
    private int _shotsFiredSinceCharge;

    public bool IsAlive => _health > 0f;
    public bool IsTargetable => targetable;
    public Transform AimPoint => firePoint != null ? firePoint : transform;

    public float Health => _health;
    public float MaxHealth => maxHealth;
    public float Armor => armor;
    public float AttackSpeed => attackSpeed;
    public float ChargeUpSpeed => chargeUpSpeed;
    public int ShotsPerCharge => shotsPerCharge;
    public float Damage => damage;
    public float Range => range;

    private void Awake()
    {
        _health = Mathf.Max(1f, maxHealth);
    }

    private void OnEnable()
    {
        UpdateTargetableRegistration();
        _shotsFiredSinceCharge = 0;
        _timeUntilNextShot = useChargeUpSpeed ? ToInterval(chargeUpSpeed) : 0f;
    }

    private void OnDisable()
    {
        TargetableRegistry.UnregisterTower(this);
    }

    private void Update()
    {
        if (!IsAlive)
        {
            return;
        }

        _timeUntilNextShot = Mathf.Max(0f, _timeUntilNextShot - Time.deltaTime);

        if (target == null || projectilePrefab == null)
        {
            return;
        }

        if (!IsTargetInRange(target))
        {
            return;
        }

        if (_timeUntilNextShot > 0f)
        {
            return;
        }

        FireAtTarget(target);
    }

    public void SetTarget(Transform newTarget)
    {
        target = newTarget;
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

        _health = Mathf.Max(0f, _health - GetMitigatedDamage(amount));
    }

    private void FireAtTarget(Transform targetTransform)
    {
        Transform spawnPoint = firePoint != null ? firePoint : transform;
        Projectile projectile = Instantiate(projectilePrefab, spawnPoint.position, spawnPoint.rotation);

        if (useTowerProjectileSettings)
        {
            projectile.Configure(
                projectileSettings.speed,
                projectileSettings.maxLifetime,
                projectileSettings.hitRadius,
                projectileSettings.armingDistance,
                projectileSettings.armingTime,
                projectileSettings.destinationArrivalDistance,
                projectileSettings.sortingOrder);
        }

        projectile.Launch(targetTransform, damage, this);
        _shotsFiredSinceCharge++;
        _timeUntilNextShot = ComputePostShotDelay();
    }

    private bool IsTargetInRange(Transform targetTransform)
    {
        Vector2 origin = firePoint != null ? (Vector2)firePoint.position : (Vector2)transform.position;
        Vector2 target = targetTransform.position;
        float sqrRange = range * range;
        return (target - origin).sqrMagnitude <= sqrRange;
    }

    private float GetMitigatedDamage(float amount)
    {
        return Mathf.Max(0f, amount - armor);
    }

    private float ComputePostShotDelay()
    {
        float delay = 0f;

        if (useAttackSpeed)
        {
            delay += ToInterval(attackSpeed);
        }

        if (useChargeUpSpeed)
        {
            int clampedShotsPerCharge = Mathf.Max(1, shotsPerCharge);
            if (_shotsFiredSinceCharge >= clampedShotsPerCharge)
            {
                delay += ToInterval(chargeUpSpeed);
                _shotsFiredSinceCharge = 0;
            }
        }

        return delay;
    }

    private static float ToInterval(float speed)
    {
        return speed <= 0f ? 0.1f : 1f / speed;
    }

    private void UpdateTargetableRegistration()
    {
        if (IsTargetable)
        {
            TargetableRegistry.RegisterTower(this);
        }
        else
        {
            TargetableRegistry.UnregisterTower(this);
        }
    }
}
