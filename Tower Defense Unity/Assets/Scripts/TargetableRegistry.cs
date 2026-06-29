using System.Collections.Generic;

public static class TargetableRegistry
{
    private static readonly List<IDamageable> Towers = new List<IDamageable>();
    private static readonly List<IDamageable> Enemies = new List<IDamageable>();

    public static IReadOnlyList<IDamageable> TowerList => Towers;
    public static IReadOnlyList<IDamageable> EnemyList => Enemies;

    public static void RegisterTower(IDamageable tower)
    {
        Register(Towers, tower);
    }

    public static void UnregisterTower(IDamageable tower)
    {
        Unregister(Towers, tower);
    }

    public static void RegisterEnemy(IDamageable enemy)
    {
        Register(Enemies, enemy);
    }

    public static void UnregisterEnemy(IDamageable enemy)
    {
        Unregister(Enemies, enemy);
    }

    private static void Register(List<IDamageable> list, IDamageable entry)
    {
        if (entry == null || list.Contains(entry))
        {
            return;
        }

        list.Add(entry);
    }

    private static void Unregister(List<IDamageable> list, IDamageable entry)
    {
        if (entry == null)
        {
            return;
        }

        list.Remove(entry);
    }
}
