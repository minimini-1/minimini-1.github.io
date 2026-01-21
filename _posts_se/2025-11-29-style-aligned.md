---
title: "A Training-Free Style-aligned Image Generation with Scale-wise Autoregressive Model"
description: arXiv preprint
author: Jihun Park*, <strong>Jongmin Gim*</strong>, Kyoungmin Lee*, Minseok Oh, Minwoo Choi, Jaeyeul Kim, Woo Chool Park, and Sunghoon Im.
categories: publications
date: 2025-11-29
pin: false
math: true
mermaid: true
image:
  path: /assets/img/post_images/style-aligned.png
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: Style-Aligned Generation
---

## Abstract

We present a training-free style-aligned image generation method that leverages a scale-wise autoregressive model. While large-scale text-to-image (T2I) models, particularly diffusion-based methods, have demonstrated impressive generation quality, they often suffer from style misalignment across generated image sets and slow inference speeds, limiting their practical usability. To address these issues, we propose three key components: initial feature replacement to ensure consistent background appearance, pivotal feature interpolation to align object placement, and dynamic style injection, which reinforces style consistency using a schedule function. Unlike previous methods requiring fine-tuning or additional training, our approach maintains fast inference while preserving individual content details. Extensive experiments show that our method achieves generation quality comparable to competing approaches, significantly improves style alignment, and delivers inference speeds over six times faster than the fastest model.

## Links

- **Paper:** [arXiv](https://arxiv.org/abs/2504.06144)

## Citation

```bibtex
@article{park2025stylealigned,
  title={A Training-Free Style-aligned Image Generation with Scale-wise Autoregressive Model},
  author={Park, Jihun and Gim, Jongmin and Lee, Kyoungmin and Oh, Minseok and Choi, Minwoo and Kim, Jaeyeul and Park, Woo Chool and Im, Sunghoon},
  journal={arXiv preprint arXiv:2504.06144},
  year={2025}
}
```
