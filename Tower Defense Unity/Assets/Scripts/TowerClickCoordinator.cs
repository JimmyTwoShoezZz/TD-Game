using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem;

public class TowerClickCoordinator : MonoBehaviour
{
    [SerializeField] private Camera mainCamera;
    [SerializeField] private TowerSelectionController selectionController;
    [SerializeField] private TowerPlacementController placementController;
    [SerializeField] private bool blockWhenPointerOverUI = true;

    private void Awake()
    {
        if (mainCamera == null)
        {
            mainCamera = Camera.main;
        }
    }

    private void Update()
    {
        if (mainCamera == null || Mouse.current == null || !Mouse.current.leftButton.wasPressedThisFrame)
        {
            return;
        }

        if (blockWhenPointerOverUI &&
            EventSystem.current != null &&
            EventSystem.current.IsPointerOverGameObject())
        {
            return;
        }

        Vector2 screenPosition = Mouse.current.position.ReadValue();
        float distanceToPlane = -mainCamera.transform.position.z;
        Vector3 worldPosition = mainCamera.ScreenToWorldPoint(
            new Vector3(screenPosition.x, screenPosition.y, distanceToPlane));

        if (selectionController != null && selectionController.TrySelectAtWorldPosition(worldPosition))
        {
            return;
        }

        if (placementController != null)
        {
            placementController.TryPlaceAtWorldPosition(worldPosition);
        }
    }
}
