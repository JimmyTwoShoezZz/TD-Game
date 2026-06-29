using System;
using UnityEngine;

public class Projectile : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private float maxLifetime = 5f;
    [SerializeField] private float hitRadius = 0.2f;
    [SerializeField] private float armingDistance = 0.01f;
    [SerializeField] private float armingTime = 0.01f;
    [SerializeField] private float destinationArrivalDistance = 0.01f;
    [SerializeField] private int sortingOrder = 200;

    private Transform _target;
    private float _damage;
    private float _lifeRemaining;
    private float _distanceTraveled;
    private float _age;
    private IDamageable _owner;
    private SpriteRenderer _spriteRenderer;
    private Vector2 _destination;
    private bool _hasDestination;
    private bool _isHoming;

    public event Action<Projectile> OnDespawned;

    private void OnEnable()
    {
        _lifeRemaining = maxLifetime;
        _distanceTraveled = 0f;
        _age = 0f;
        _hasDestination = false;
        _isHoming = false;

        if (_spriteRenderer == null)
        {
            _spriteRenderer = GetComponent<SpriteRenderer>();
        }

        if (_spriteRenderer != null)
        {
            _spriteRenderer.sortingOrder = sortingOrder;
        }
    }

    public void Launch(Transform target, float damage, IDamageable owner)
    {
        _target = target;
        _damage = damage;
        _owner = owner;

        if (_target != null)
        {
            _destination = _target.position;
            _hasDestination = true;
            _isHoming = true;
        }
    }

    public void Configure(
        float newSpeed,
        float newMaxLifetime,
        float newHitRadius,
        float newArmingDistance,
        float newArmingTime,
        float newDestinationArrivalDistance,
        int newSortingOrder)
    {
        speed = Mathf.Max(0.01f, newSpeed);
        maxLifetime = Mathf.Max(0.01f, newMaxLifetime);
        hitRadius = Mathf.Max(0.001f, newHitRadius);
        armingDistance = Mathf.Max(0f, newArmingDistance);
        armingTime = Mathf.Max(0f, newArmingTime);
        destinationArrivalDistance = Mathf.Max(0.0001f, newDestinationArrivalDistance);
        sortingOrder = newSortingOrder;

        _lifeRemaining = maxLifetime;

        if (_spriteRenderer == null)
        {
            _spriteRenderer = GetComponent<SpriteRenderer>();
        }

        if (_spriteRenderer != null)
        {
            _spriteRenderer.sortingOrder = sortingOrder;
        }
    }

    private void Update()
    {
        _lifeRemaining -= Time.deltaTime;
        _age += Time.deltaTime;
        if (_lifeRemaining <= 0f)
        {
            Despawn();
            return;
        }

        IDamageable damageable = null;
        if (_isHoming)
        {
            if (TryResolveLiveAimPoint(out Vector2 aimPoint, out damageable))
            {
                _destination = aimPoint;
                _hasDestination = true;
            }
            else
            {
                _isHoming = false;
                _target = null;
            }
        }

        if (!_hasDestination)
        {
            Despawn();
            return;
        }

        Vector2 toTarget = _destination - (Vector2)transform.position;
        float distanceThisFrame = speed * Time.deltaTime;
        float reachDistance = distanceThisFrame + (_isHoming ? hitRadius : destinationArrivalDistance);

        bool isArmed = _distanceTraveled >= armingDistance && _age >= armingTime;
        if (_isHoming && isArmed && IsWithinDistance(toTarget, reachDistance))
        {
            if (damageable != null && damageable.IsAlive && damageable.IsTargetable && damageable != _owner)
            {
                damageable.TakeDamage(_damage);
            }

            Despawn();
            return;
        }

        if (!_isHoming && IsWithinDistance(toTarget, reachDistance))
        {
            transform.position = _destination;
            Despawn();
            return;
        }

        if (toTarget.sqrMagnitude > 0.0001f)
        {
            float angle = Mathf.Atan2(toTarget.y, toTarget.x) * Mathf.Rad2Deg;
            transform.rotation = Quaternion.Euler(0f, 0f, angle);
        }

        transform.position += (Vector3)(toTarget.normalized * distanceThisFrame);
        _distanceTraveled += distanceThisFrame;
    }

    private static bool IsWithinDistance(Vector2 delta, float distance)
    {
        return delta.sqrMagnitude <= distance * distance;
    }

    private bool TryResolveLiveAimPoint(out Vector2 aimPoint, out IDamageable damageable)
    {
        aimPoint = _destination;
        damageable = null;

        if (_target == null)
        {
            return false;
        }

        aimPoint = _target.position;

        if (_target.TryGetComponent<IDamageable>(out damageable))
        {
            if (!damageable.IsAlive || !damageable.IsTargetable)
            {
                return false;
            }

            Transform aim = damageable.AimPoint != null ? damageable.AimPoint : _target;
            aimPoint = aim.position;
        }

        return true;
    }

    private void Despawn()
    {
        OnDespawned?.Invoke(this);
        Destroy(gameObject);
    }
}
