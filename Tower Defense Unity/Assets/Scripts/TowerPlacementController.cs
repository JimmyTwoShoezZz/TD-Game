using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

public class TowerPlacementController : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private Tilemap buildableTilemap;
    [SerializeField] private Tilemap blockedTilemap;
    [SerializeField] private Tilemap[] blockedTilemaps;
    [SerializeField] private GameObject towerPrefab;
    [SerializeField] private Transform towersParent;

    [Header("Placement Rules")]
    [SerializeField] private bool preventDuplicatePlacement = true;

    private readonly HashSet<Vector3Int> _occupiedCells = new HashSet<Vector3Int>();

    private void Awake()
    {
        CacheExistingTowerCells();
    }

    public bool TryPlaceAtWorldPosition(Vector3 worldPosition)
    {
        if (buildableTilemap == null || towerPrefab == null)
        {
            return false;
        }

        if (IsTowerAtWorldPoint(worldPosition))
        {
            return false;
        }

        Vector3Int cell = buildableTilemap.WorldToCell(worldPosition);
        if (!CanPlaceAtCell(cell))
        {
            return false;
        }

        Vector3 spawnPosition = buildableTilemap.GetCellCenterWorld(cell);
        GameObject tower = Instantiate(towerPrefab, spawnPosition, towerPrefab.transform.rotation);

        if (towersParent != null)
        {
            tower.transform.SetParent(towersParent, true);
        }

        if (preventDuplicatePlacement)
        {
            _occupiedCells.Add(cell);
        }

        return true;
    }

    private bool CanPlaceAtCell(Vector3Int cell)
    {
        if (!buildableTilemap.HasTile(cell))
        {
            return false;
        }

        if (IsBlockedCell(cell))
        {
            return false;
        }

        if (preventDuplicatePlacement && _occupiedCells.Contains(cell))
        {
            return false;
        }

        return true;
    }

    private bool IsBlockedCell(Vector3Int cell)
    {
        if (blockedTilemap != null && blockedTilemap.HasTile(cell))
        {
            return true;
        }

        if (blockedTilemaps == null)
        {
            return false;
        }

        for (int i = 0; i < blockedTilemaps.Length; i++)
        {
            Tilemap map = blockedTilemaps[i];
            if (map != null && map.HasTile(cell))
            {
                return true;
            }
        }

        return false;
    }

    private static bool IsTowerAtWorldPoint(Vector3 worldPoint)
    {
        Collider2D hit = Physics2D.OverlapPoint(worldPoint);
        if (hit == null)
        {
            return false;
        }

        return hit.GetComponentInParent<Tower>() != null;
    }

    private void CacheExistingTowerCells()
    {
        if (!preventDuplicatePlacement || buildableTilemap == null || towersParent == null)
        {
            return;
        }

        _occupiedCells.Clear();

        for (int i = 0; i < towersParent.childCount; i++)
        {
            Transform child = towersParent.GetChild(i);
            Vector3Int cell = buildableTilemap.WorldToCell(child.position);
            _occupiedCells.Add(cell);
        }
    }
}
