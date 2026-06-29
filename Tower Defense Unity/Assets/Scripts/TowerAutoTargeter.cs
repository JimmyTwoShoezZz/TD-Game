using UnityEngine;

public class TowerAutoTargeter : MonoBehaviour
{
    [SerializeField] private Tower tower;
    [SerializeField] private bool requireTargetInRange = true;

    private static readonly System.Collections.Generic.List<IDamageable> NearbyCandidates = new System.Collections.Generic.List<IDamageable>(64);
    private IDamageable _currentTarget;

    private void Awake()
    {
        if (tower == null)
        {
            tower = GetComponent<Tower>();
        }
    }

    private void Update()
    {
        if (tower == null)
        {
            return;
        }

        Vector2 origin = tower.AimPoint != null ? (Vector2)tower.AimPoint.position : (Vector2)transform.position;
        float rangeSqr = tower.Range * tower.Range;
        if (IsValidTarget(_currentTarget, origin, rangeSqr, out Transform currentAimPoint))
        {
            tower.SetTarget(currentAimPoint);
            return;
        }

        _currentTarget = FindBestTarget(origin, rangeSqr);
        if (TryGetAimPoint(_currentTarget, out Transform newAimPoint))
        {
            tower.SetTarget(newAimPoint);
        }
        else
        {
            tower.SetTarget(null);
        }
    }

    private IDamageable FindBestTarget(Vector2 origin, float rangeSqr)
    {
        IDamageable best = null;
        float bestHealth = float.MaxValue;
        float bestDistance = float.MaxValue;

        var candidates = requireTargetInRange ? GetNearbyCandidates(origin, tower.Range) : TargetableRegistry.EnemyList;
        for (int i = 0; i < candidates.Count; i++)
        {
            IDamageable candidate = candidates[i];
            if (!IsValidTarget(candidate, origin, rangeSqr, out Transform candidateTransform))
            {
                continue;
            }

            Vector2 candidatePosition = candidateTransform.position;
            float sqr = (candidatePosition - origin).sqrMagnitude;

            float health = GetCandidateHealth(candidate);

            if (best == null || health < bestHealth || (Mathf.Approximately(health, bestHealth) && sqr < bestDistance))
            {
                best = candidate;
                bestHealth = health;
                bestDistance = sqr;
            }
        }

        return best;
    }

    private static System.Collections.Generic.IReadOnlyList<IDamageable> GetNearbyCandidates(Vector2 origin, float range)
    {
        EnemySpatialIndex.QueryInRange(origin, range, NearbyCandidates);
        return NearbyCandidates;
    }

    private bool IsValidTarget(IDamageable candidate, Vector2 origin, float rangeSqr, out Transform aimPoint)
    {
        aimPoint = null;
        if (!IsUnityReferenceAlive(candidate))
        {
            return false;
        }

        if (!candidate.IsAlive || !candidate.IsTargetable)
        {
            return false;
        }

        if (!TryGetAimPoint(candidate, out aimPoint))
        {
            return false;
        }

        if (!requireTargetInRange)
        {
            return true;
        }

        Vector2 candidatePosition = aimPoint.position;
        float sqr = (candidatePosition - origin).sqrMagnitude;
        return sqr <= rangeSqr;
    }

    private static float GetCandidateHealth(IDamageable candidate)
    {
        if (candidate is Enemy enemy)
        {
            return enemy.Health;
        }

        return float.MaxValue;
    }

    private static bool TryGetAimPoint(IDamageable candidate, out Transform aimPoint)
    {
        aimPoint = null;
        if (!IsUnityReferenceAlive(candidate))
        {
            return false;
        }

        aimPoint = candidate.AimPoint;
        return aimPoint != null;
    }

    private static bool IsUnityReferenceAlive(IDamageable candidate)
    {
        Object unityObject = candidate as Object;
        return unityObject != null;
    }
}
