using UnityEngine;

public class Path2D : MonoBehaviour
{
    [SerializeField] private Transform[] checkpoints;

    public int Count => checkpoints != null ? checkpoints.Length : 0;

    public Transform GetCheckpoint(int index)
    {
        return IsValidIndex(index) ? checkpoints[index] : null;
    }

    private bool IsValidIndex(int index)
    {
        return checkpoints != null && index >= 0 && index < checkpoints.Length;
    }
}
