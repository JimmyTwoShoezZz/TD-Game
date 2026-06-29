using UnityEngine;

public class Markers : MonoBehaviour
{
    [SerializeField] private Transform pathStart;
    [SerializeField] private Transform pathEnd;

    public Transform PathStart => pathStart;
    public Transform PathEnd => pathEnd;
}
