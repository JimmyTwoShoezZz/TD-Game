using UnityEngine;

public class SimpleEnemyHealthBar : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private Enemy health;

    [Header("Bar Layout")]
    [SerializeField] private Vector3 worldOffset = new Vector3(0f, 0.55f, 0f);
    [SerializeField] private Vector2 barSize = new Vector2(0.6f, 0.08f);
    [SerializeField] private int sortingOrder = 100;

    [Header("Colors")]
    [SerializeField] private Color backgroundColor = new Color(0.15f, 0.15f, 0.15f, 1f);
    [SerializeField] private Color fillColor = new Color(0.2f, 0.9f, 0.2f, 1f);

    private static Sprite _pixelSprite;

    private Transform _barRoot;
    private Transform _fillTransform;
    private SpriteRenderer _backgroundRenderer;
    private SpriteRenderer _fillRenderer;

    private void Awake()
    {
        if (health == null)
        {
            health = GetComponent<Enemy>();
        }

        EnsureBarVisuals();
        ApplyHealthVisual(GetNormalizedHealth());
    }

    private void OnDestroy()
    {
        if (_barRoot != null)
        {
            Destroy(_barRoot.gameObject);
        }
    }

    private void LateUpdate()
    {
        if (_barRoot != null)
        {
            _barRoot.position = transform.position + worldOffset;
        }
        ApplyHealthVisual(GetNormalizedHealth());
    }

    private void EnsureBarVisuals()
    {
        if (_barRoot != null && _fillTransform != null)
        {
            return;
        }

        Sprite sprite = GetPixelSprite();

        _barRoot = new GameObject("HealthBar").transform;
        _barRoot.SetParent(null);
        _barRoot.position = transform.position + worldOffset;

        _backgroundRenderer = CreateSegmentRenderer("Background", sprite, backgroundColor, out Transform background);
        background.localScale = new Vector3(barSize.x, barSize.y, 1f);
        _fillRenderer = CreateSegmentRenderer("Fill", sprite, fillColor, out _fillTransform);

        ApplySorting();
    }

    private void ApplyHealthVisual(float normalized)
    {
        if (_fillTransform == null)
        {
            return;
        }

        float clamped = Mathf.Clamp01(normalized);
        float width = barSize.x * clamped;
        float x = (-barSize.x * 0.5f) + (width * 0.5f);

        _fillTransform.localPosition = new Vector3(x, 0f, 0f);
        _fillTransform.localScale = new Vector3(width, barSize.y, 1f);
    }

    private static Sprite GetPixelSprite()
    {
        if (_pixelSprite != null)
        {
            return _pixelSprite;
        }

        var texture = new Texture2D(1, 1, TextureFormat.RGBA32, false);
        texture.SetPixel(0, 0, Color.white);
        texture.Apply();
        texture.wrapMode = TextureWrapMode.Clamp;
        texture.filterMode = FilterMode.Point;

        _pixelSprite = Sprite.Create(
            texture,
            new Rect(0f, 0f, 1f, 1f),
            new Vector2(0.5f, 0.5f),
            1f);

        return _pixelSprite;
    }

    private SpriteRenderer CreateSegmentRenderer(string segmentName, Sprite sprite, Color color, out Transform segmentTransform)
    {
        segmentTransform = new GameObject(segmentName).transform;
        segmentTransform.SetParent(_barRoot, false);

        SpriteRenderer renderer = segmentTransform.gameObject.AddComponent<SpriteRenderer>();
        renderer.sprite = sprite;
        renderer.color = color;
        return renderer;
    }

    private void ApplySorting()
    {
        if (_backgroundRenderer == null || _fillRenderer == null)
        {
            return;
        }

        int baseOrder = sortingOrder;
        string layerName = "Default";

        if (TryGetComponent<SpriteRenderer>(out var enemyRenderer))
        {
            baseOrder = enemyRenderer.sortingOrder + 10;
            layerName = enemyRenderer.sortingLayerName;
        }

        _backgroundRenderer.sortingLayerName = layerName;
        _fillRenderer.sortingLayerName = layerName;
        _backgroundRenderer.sortingOrder = baseOrder;
        _fillRenderer.sortingOrder = baseOrder + 1;
    }

    private float GetNormalizedHealth()
    {
        if (health == null || health.MaxHealth <= 0f)
        {
            return 1f;
        }

        return Mathf.Clamp01(health.Health / health.MaxHealth);
    }
}
