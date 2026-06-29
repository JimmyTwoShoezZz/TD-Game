using System.Collections.Generic;
using UnityEngine;

public static class EnemySpatialIndex
{
    private const float CellSize = 2f;

    private static readonly Dictionary<Vector2Int, List<IDamageable>> Buckets = new Dictionary<Vector2Int, List<IDamageable>>();
    private static readonly Dictionary<IDamageable, Vector2Int> EnemyCells = new Dictionary<IDamageable, Vector2Int>();

    public static void Register(IDamageable enemy, Vector2 position)
    {
        if (!IsAliveUnityReference(enemy) || EnemyCells.ContainsKey(enemy))
        {
            return;
        }

        Vector2Int cell = GetCell(position);
        EnemyCells[enemy] = cell;

        if (!Buckets.TryGetValue(cell, out var bucket))
        {
            bucket = new List<IDamageable>();
            Buckets[cell] = bucket;
        }

        bucket.Add(enemy);
    }

    public static void Unregister(IDamageable enemy)
    {
        if (!EnemyCells.TryGetValue(enemy, out Vector2Int oldCell))
        {
            return;
        }

        EnemyCells.Remove(enemy);
        if (!Buckets.TryGetValue(oldCell, out var bucket))
        {
            return;
        }

        bucket.Remove(enemy);
        if (bucket.Count == 0)
        {
            Buckets.Remove(oldCell);
        }
    }

    public static void UpdatePosition(IDamageable enemy, Vector2 position)
    {
        if (!EnemyCells.TryGetValue(enemy, out Vector2Int oldCell))
        {
            return;
        }

        Vector2Int newCell = GetCell(position);
        if (oldCell == newCell)
        {
            return;
        }

        if (Buckets.TryGetValue(oldCell, out var oldBucket))
        {
            oldBucket.Remove(enemy);
            if (oldBucket.Count == 0)
            {
                Buckets.Remove(oldCell);
            }
        }

        EnemyCells[enemy] = newCell;
        if (!Buckets.TryGetValue(newCell, out var newBucket))
        {
            newBucket = new List<IDamageable>();
            Buckets[newCell] = newBucket;
        }

        newBucket.Add(enemy);
    }

    public static void QueryInRange(Vector2 center, float range, List<IDamageable> results)
    {
        results.Clear();
        float sqrRange = range * range;

        int minX = Mathf.FloorToInt((center.x - range) / CellSize);
        int maxX = Mathf.FloorToInt((center.x + range) / CellSize);
        int minY = Mathf.FloorToInt((center.y - range) / CellSize);
        int maxY = Mathf.FloorToInt((center.y + range) / CellSize);

        for (int x = minX; x <= maxX; x++)
        {
            for (int y = minY; y <= maxY; y++)
            {
                Vector2Int cell = new Vector2Int(x, y);
                if (!Buckets.TryGetValue(cell, out var bucket))
                {
                    continue;
                }

                for (int i = 0; i < bucket.Count; i++)
                {
                    IDamageable enemy = bucket[i];
                    if (!IsAliveUnityReference(enemy))
                    {
                        continue;
                    }

                    Transform aimPoint = enemy.AimPoint;
                    if (aimPoint == null)
                    {
                        continue;
                    }

                    Vector2 delta = (Vector2)aimPoint.position - center;
                    if (delta.sqrMagnitude <= sqrRange)
                    {
                        results.Add(enemy);
                    }
                }
            }
        }
    }

    private static Vector2Int GetCell(Vector2 position)
    {
        int x = Mathf.FloorToInt(position.x / CellSize);
        int y = Mathf.FloorToInt(position.y / CellSize);
        return new Vector2Int(x, y);
    }

    private static bool IsAliveUnityReference(IDamageable target)
    {
        Object unityObject = target as Object;
        return unityObject != null;
    }
}
