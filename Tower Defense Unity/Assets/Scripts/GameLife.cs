using TMPro;
using UnityEngine;

public class GameLife : MonoBehaviour
{
    public static GameLife Instance { get; private set; }

    [SerializeField] private int startingLives = 10;
    [SerializeField] private TMP_Text livesText;
    [SerializeField] private string livesPrefix = "Lives: ";

    private int _currentLives;

    public int CurrentLives => _currentLives;
    public int StartingLives => startingLives;
    public bool IsGameOver => _currentLives <= 0;

    private void OnEnable()
    {
        if (Instance != null && Instance != this)
        {
            gameObject.SetActive(false);
            return;
        }

        Instance = this;
        ResetLives();
    }

    private void OnDisable()
    {
        if (Instance == this)
        {
            Instance = null;
        }
    }

    public void ResetLives()
    {
        _currentLives = Mathf.Max(0, startingLives);
        UpdateLivesText();
    }

    public void LoseLife(int amount = 1)
    {
        if (amount <= 0 || IsGameOver)
        {
            return;
        }

        _currentLives = Mathf.Max(0, _currentLives - amount);
        UpdateLivesText();
    }

    private void UpdateLivesText()
    {
        if (livesText == null)
        {
            return;
        }

        livesText.text = $"{livesPrefix}{_currentLives}";
    }
}
