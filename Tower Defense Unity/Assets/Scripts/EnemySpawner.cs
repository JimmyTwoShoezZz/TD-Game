using UnityEngine;

public class EnemySpawner : MonoBehaviour
{
    [Header("Setup")]
    [SerializeField] private GameObject enemyPrefab;
    [SerializeField] private Path2D path;
    [SerializeField] private Transform spawnPoint;

    [Header("Spawning")]
    [SerializeField] private bool spawnOnStart = true;
    [SerializeField] private float spawnInterval = 2f;
    [SerializeField] private int maxSpawns = 0; // 0 = infinite

    private float _spawnTimer;
    private int _spawnedCount;
    private bool _isSpawning;

    private void Start()
    {
        if (spawnOnStart)
        {
            StartSpawning();
        }
    }

    private void Update()
    {
        if (!_isSpawning || enemyPrefab == null)
        {
            return;
        }

        _spawnTimer -= Time.deltaTime;
        if (_spawnTimer > 0f)
        {
            return;
        }

        SpawnOneEnemy();
        _spawnTimer = Mathf.Max(0.01f, spawnInterval);

        _isSpawning = !HasReachedSpawnLimit();
    }

    public void StartSpawning()
    {
        _isSpawning = true;
        _spawnTimer = 0f; // spawn immediately
    }

    public void StopSpawning()
    {
        _isSpawning = false;
    }

    [ContextMenu("Spawn One Enemy")]
    public void SpawnOneEnemy()
    {
        if (enemyPrefab == null)
        {
            return;
        }

        Vector3 position = ResolveSpawnPosition();
        Quaternion rotation = enemyPrefab.transform.rotation;
        GameObject enemy = Instantiate(enemyPrefab, position, rotation);
        _spawnedCount++;

        if (path != null && enemy.TryGetComponent<Enemy>(out var enemyComponent))
        {
            enemyComponent.SetPrimaryPath(path);
        }
    }

    private bool HasReachedSpawnLimit()
    {
        return maxSpawns > 0 && _spawnedCount >= maxSpawns;
    }

    private Vector3 ResolveSpawnPosition()
    {
        if (spawnPoint != null)
        {
            return spawnPoint.position;
        }

        if (path != null && path.Count > 0)
        {
            Transform first = path.GetCheckpoint(0);
            if (first != null)
            {
                return first.position;
            }
        }

        return transform.position;
    }
}
