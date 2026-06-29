using UnityEngine;

public interface IDamageable
{
    void TakeDamage(float amount);
    bool IsAlive { get; }
    bool IsTargetable { get; }
    Transform AimPoint { get; }
}
