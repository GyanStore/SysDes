"""Scaled dot-product attention (NumPy).

    Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V

"""

from __future__ import annotations

import numpy as np


def softmax(x: np.ndarray, axis: int = -1) -> np.ndarray:
    """Numerically stable softmax along ``axis``."""
    x = x - np.max(x, axis=axis, keepdims=True)
    e = np.exp(x)
    return e / np.sum(e, axis=axis, keepdims=True)


def causal_mask(n: int) -> np.ndarray:
    """Boolean (n, n) mask where True marks positions that may be attended to.

    A lower-triangular mask: query i can attend to keys j <= i.
    """
    return np.tril(np.ones((n, n), dtype=bool))


def scaled_dot_product_attention(
    Q: np.ndarray,
    K: np.ndarray,
    V: np.ndarray,
    mask: np.ndarray | None = None,
    causal: bool = False,
):
    """Scaled dot-product attention.

    Args:
        Q, K, V: arrays of shape (..., n, d_k). Any number of leading batch
            dimensions is allowed (e.g. (n, d_k) or (batch, heads, n, d_k)).
        mask: optional boolean array broadcastable to (..., n, n). True =
            keep, False = disallow (set to -inf before softmax).
        causal: if True, apply a lower-triangular causal mask automatically.

    Returns:
        output:  (..., n, d_k) -- attention-weighted values.
        weights: (..., n, n)   -- attention probability matrix.
    """
    Q = np.asarray(Q, dtype=np.float64)
    K = np.asarray(K, dtype=np.float64)
    V = np.asarray(V, dtype=np.float64)

    d_k = Q.shape[-1]
    # (..., n, d_k) @ (..., d_k, n) -> (..., n, n)
    scores = np.matmul(Q, np.swapaxes(K, -1, -2)) / np.sqrt(d_k)

    if causal:
        n = scores.shape[-2]
        cmask = causal_mask(n)
        mask = cmask if mask is None else (mask & cmask)

    if mask is not None:
        scores = np.where(mask, scores, -np.inf)

    weights = softmax(scores, axis=-1)
    output = np.matmul(weights, V)
    return output, weights


def multi_head_attention(
    Q: np.ndarray,
    K: np.ndarray,
    V: np.ndarray,
    mask: np.ndarray | None = None,
    causal: bool = False,
):
    """Batched multi-head attention.

    Inputs are (batch, heads, n, d_k). This is simply
    ``scaled_dot_product_attention`` applied over the leading (batch, heads)
    dimensions -- kept as a named entry point for clarity.

    Returns:
        output:  (batch, heads, n, d_k)
        weights: (batch, heads, n, n)
    """
    if Q.ndim != 4:
        raise ValueError(
            f"expected (batch, heads, n, d_k), got shape {Q.shape}"
        )
    return scaled_dot_product_attention(Q, K, V, mask=mask, causal=causal)


if __name__ == "__main__":
    rng = np.random.default_rng(0)

    # --- single sequence: (n, d_k) ---
    n, d_k = 4, 8
    Q = rng.standard_normal((n, d_k))
    K = rng.standard_normal((n, d_k))
    V = rng.standard_normal((n, d_k))

    out, w = scaled_dot_product_attention(Q, K, V)
    print("single    out:", out.shape, "weights:", w.shape)
    assert out.shape == (n, d_k) and w.shape == (n, n)
    assert np.allclose(w.sum(-1), 1.0), "rows must sum to 1"

    # --- causal: no attention to the future ---
    out_c, w_c = scaled_dot_product_attention(Q, K, V, causal=True)
    upper = np.triu(np.ones((n, n), bool), k=1)
    assert np.allclose(w_c[upper], 0.0), "future positions must be masked"
    assert np.allclose(w_c.sum(-1), 1.0)
    print("causal    ok (upper triangle is zero)")

    # --- batched multi-head: (batch, heads, n, d_k) ---
    b, h = 2, 3
    Qb = rng.standard_normal((b, h, n, d_k))
    Kb = rng.standard_normal((b, h, n, d_k))
    Vb = rng.standard_normal((b, h, n, d_k))
    outb, wb = multi_head_attention(Qb, Kb, Vb, causal=True)
    print("multihead out:", outb.shape, "weights:", wb.shape)
    assert outb.shape == (b, h, n, d_k) and wb.shape == (b, h, n, n)
    assert np.allclose(wb.sum(-1), 1.0)

    # batched result must match looping per (batch, head)
    for i in range(b):
        for j in range(h):
            o_ref, _ = scaled_dot_product_attention(
                Qb[i, j], Kb[i, j], Vb[i, j], causal=True
            )
            assert np.allclose(outb[i, j], o_ref)
    print("all checks passed")
