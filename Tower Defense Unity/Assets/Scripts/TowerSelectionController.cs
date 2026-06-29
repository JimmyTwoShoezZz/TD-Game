using UnityEngine;
using UnityEngine.Tilemaps;

public class TowerSelectionController : MonoBehaviour
{
    [SerializeField] private LayerMask towerLayerMask = ~0;
    [SerializeField] private Tilemap placementTilemap;
    [SerializeField] private Transform towersParent;

    public Tower SelectedTower { get; private set; }

    public void ClearSelection()
    {
        SelectedTower = null;
    }

    public bool TrySelectAtWorldPosition(Vector3 worldPosition)
    {
        if (TrySelectTowerFromCell(worldPosition))
        {
            return true;
        }

        return TrySelectTowerFromOverlap(worldPosition);
    }

    private bool TrySelectTowerFromOverlap(Vector3 worldPosition)
    {
        Collider2D[] hits = Physics2D.OverlapPointAll(worldPosition, towerLayerMask);
        for (int i = 0; i < hits.Length; i++)
        {
            Collider2D hit = hits[i];
            Tower tower = hit != null ? hit.GetComponentInParent<Tower>() : null;
            if (tower != null)
            {
                SelectedTower = tower;
                return true;
            }
        }

        SelectedTower = null;
        return false;
    }

    private bool TrySelectTowerFromCell(Vector3 worldPosition)
    {
        if (placementTilemap == null || towersParent == null)
        {
            return false;
        }

        Vector3Int clickedCell = placementTilemap.WorldToCell(worldPosition);
        for (int i = 0; i < towersParent.childCount; i++)
        {
            Transform child = towersParent.GetChild(i);
            if (child == null)
            {
                continue;
            }

            Vector3Int towerCell = placementTilemap.WorldToCell(child.position);
            if (towerCell != clickedCell)
            {
                continue;
            }

            Tower tower = child.GetComponent<Tower>();
            if (tower != null)
            {
                SelectedTower = tower;
                return true;
            }
        }

        return false;
    }
}
