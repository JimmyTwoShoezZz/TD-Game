using UnityEngine;

[RequireComponent(typeof(LineRenderer))]
public class TowerSelectionOutline : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private TowerSelectionController selectionController;

    [Header("Outline")]
    [SerializeField] private Color outlineColor = Color.green;
    [SerializeField] private float lineWidth = 0.06f;
    [SerializeField] private Vector2 outlineSize = new Vector2(1f, 1f);
    [SerializeField] private Vector3 worldOffset = Vector3.zero;
    [SerializeField] private int fallbackSortingOrder = 500;

    private LineRenderer _lineRenderer;
    private readonly Vector3[] _points = new Vector3[5];

    private void Awake()
    {
        _lineRenderer = GetComponent<LineRenderer>();
        _lineRenderer.useWorldSpace = true;
        _lineRenderer.loop = false;
        _lineRenderer.positionCount = 5;
        _lineRenderer.enabled = false;
        _lineRenderer.material = new Material(Shader.Find("Sprites/Default"));
    }

    private void Update()
    {
        Tower selectedTower = selectionController != null ? selectionController.SelectedTower : null;
        if (selectedTower == null)
        {
            _lineRenderer.enabled = false;
            return;
        }

        Vector3 center = selectedTower.transform.position + worldOffset;
        float halfX = outlineSize.x * 0.5f;
        float halfY = outlineSize.y * 0.5f;

        _points[0] = new Vector3(center.x - halfX, center.y - halfY, center.z);
        _points[1] = new Vector3(center.x + halfX, center.y - halfY, center.z);
        _points[2] = new Vector3(center.x + halfX, center.y + halfY, center.z);
        _points[3] = new Vector3(center.x - halfX, center.y + halfY, center.z);
        _points[4] = _points[0];

        ApplyStyle(selectedTower);
        _lineRenderer.SetPositions(_points);
        _lineRenderer.enabled = true;
    }

    private void ApplyStyle(Tower selectedTower)
    {
        _lineRenderer.startColor = outlineColor;
        _lineRenderer.endColor = outlineColor;
        _lineRenderer.startWidth = lineWidth;
        _lineRenderer.endWidth = lineWidth;

        if (selectedTower.TryGetComponent<SpriteRenderer>(out var spriteRenderer))
        {
            _lineRenderer.sortingLayerName = spriteRenderer.sortingLayerName;
            _lineRenderer.sortingOrder = spriteRenderer.sortingOrder + 20;
            return;
        }

        _lineRenderer.sortingOrder = fallbackSortingOrder;
    }
}
