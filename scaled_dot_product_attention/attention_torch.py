"""Scaled dot-product attention (PyTorch).

Mirror of ``attention.py`` using torch tensors. Works for (n, d_k) inputs and
for batched multi-head inputs (batch, heads, n, d_k) via broadcasting.
"""

from __future__ import annotations

import torch
import torch.nn.functional as F


def scaled_dot_product_attention(
    Q: torch.Tensor,
    K: torch.Tensor,
    V: torch.Tensor,
    mask: torch.Tensor | None = None,
    causal: bool = False,
):
    """Scaled dot-product attention.

    Args:
        Q, K, V: (..., n, d_k) tensors with any number of leading batch dims.
        mask: optional bool tensor broadcastable to (..., n, n); True = keep.
        causal: if True, apply a lower-triangular causal mask.

    Returns:
        output:  (..., n, d_k)
        weights: (..., n, n)
    """
    d_k = Q.shape[-1]
    scores = Q @ K.transpose(-2, -1) / (d_k ** 0.5)

    if causal:
        n = scores.shape[-2]
        cmask = torch.tril(torch.ones(n, n, dtype=torch.bool, device=scores.device))
        mask = cmask if mask is None else (mask & cmask)

    if mask is not None:
        scores = scores.masked_fill(~mask, float("-inf"))

    weights = F.softmax(scores, dim=-1)
    output = weights @ V
    return output, weights


if __name__ == "__main__":
    torch.manual_seed(0)

    n, d_k = 4, 8
    Q, K, V = (torch.randn(n, d_k) for _ in range(3))
    out, w = scaled_dot_product_attention(Q, K, V)
    print("single    out:", tuple(out.shape), "weights:", tuple(w.shape))
    assert torch.allclose(w.sum(-1), torch.ones(n))

    out_c, w_c = scaled_dot_product_attention(Q, K, V, causal=True)
    assert torch.allclose(torch.triu(w_c, diagonal=1), torch.zeros(n, n))
    print("causal    ok")

    b, h = 2, 3
    Qb, Kb, Vb = (torch.randn(b, h, n, d_k) for _ in range(3))
    outb, wb = scaled_dot_product_attention(Qb, Kb, Vb, causal=True)
    print("multihead out:", tuple(outb.shape), "weights:", tuple(wb.shape))
    assert outb.shape == (b, h, n, d_k)

    # cross-check against torch's built-in reference
    ref = F.scaled_dot_product_attention(Qb, Kb, Vb, is_causal=True)
    assert torch.allclose(outb, ref, atol=1e-5)
    print("matches torch.nn.functional reference")
