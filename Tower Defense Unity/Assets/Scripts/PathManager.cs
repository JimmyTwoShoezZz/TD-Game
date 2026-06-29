using System.Collections.Generic;
using UnityEngine;

public class PathManager : MonoBehaviour
{
    private static readonly List<Enemy> Enemies = new List<Enemy>();
    private static PathManager _instance;

    [SerializeField] private bool shortcutActive = false;

    private void OnEnable()
    {
        _instance = this;
        BroadcastShortcutState();
    }

    private void OnDisable()
    {
        if (_instance == this)
        {
            _instance = null;
        }
    }

    public void ActivateShortcut()
    {
        SetShortcutActive(true);
    }

    public void DeactivateShortcut()
    {
        SetShortcutActive(false);
    }

    public void SetShortcutActive(bool isActive)
    {
        shortcutActive = isActive;
        BroadcastShortcutState();
    }

    public static void RegisterEnemy(Enemy enemy)
    {
        if (enemy == null || Enemies.Contains(enemy))
        {
            return;
        }

        Enemies.Add(enemy);
        if (_instance != null)
        {
            enemy.SetShortcutActive(_instance.shortcutActive);
        }
    }

    public static void UnregisterEnemy(Enemy enemy)
    {
        if (enemy != null)
        {
            Enemies.Remove(enemy);
        }
    }

    private void BroadcastShortcutState()
    {
        if (Enemies.Count == 0)
        {
            return;
        }

        for (int i = Enemies.Count - 1; i >= 0; i--)
        {
            Enemy enemy = Enemies[i];
            if (enemy == null)
            {
                Enemies.RemoveAt(i);
                continue;
            }

            enemy.SetShortcutActive(shortcutActive);
        }
    }
}
