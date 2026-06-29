using TMPro;
using UnityEngine;

public class TowerInfoPanel : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private TowerSelectionController selectionController;
    [SerializeField] private GameObject panelRoot;

    [Header("Stat Fields")]
    [SerializeField] private TMP_Text healthText;
    [SerializeField] private TMP_Text armorText;
    [SerializeField] private TMP_Text damageText;
    [SerializeField] private TMP_Text attackSpeedText;
    [SerializeField] private TMP_Text rangeText;

    [Header("Behavior")]
    [SerializeField] private bool hideWhenNoSelection = true;

    private void Update()
    {
        Tower tower = selectionController != null ? selectionController.SelectedTower : null;

        bool hasTower = tower != null;
        if (hideWhenNoSelection && panelRoot != null)
        {
            panelRoot.SetActive(hasTower);
        }

        if (!hasTower)
        {
            if (!hideWhenNoSelection)
            {
                ClearText();
            }

            return;
        }

        SetText(healthText, $"Health: {tower.Health:0}/{tower.MaxHealth:0}");
        SetText(armorText, $"Armor: {tower.Armor:0.##}");
        SetText(damageText, $"Damage: {tower.Damage:0.##}");
        SetText(attackSpeedText, $"Attack Speed: {tower.AttackSpeed:0.##}");
        SetText(rangeText, $"Range: {tower.Range:0.##}");
    }

    private static void SetText(TMP_Text field, string value)
    {
        if (field != null)
        {
            field.text = value;
        }
    }

    private void ClearText()
    {
        SetText(healthText, "Health: -");
        SetText(armorText, "Armor: -");
        SetText(damageText, "Damage: -");
        SetText(attackSpeedText, "Attack Speed: -");
        SetText(rangeText, "Range: -");
    }
}
