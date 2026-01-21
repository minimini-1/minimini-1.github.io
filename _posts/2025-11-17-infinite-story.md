---
title: "Infinite-Story: A Training-Free Consistent Text-to-Image Generation"
description: AAAI 2026 (Oral)
author: Jihun Park*, Kyoungmin Lee*, <strong>Jongmin Gim*</strong>, Hyeonseo Jo, Minseok Oh, Wonhyeok Choi, Kyumin Hwang, Jaeyeul Kim, Minwoo Choi, and Sunghoon Im.
categories: publications
date: 2025-11-17
pin: false
math: true
mermaid: true
image:
  path: /assets/img/post_images/infinite_story.png
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: Infinite-Story
---

## Abstract

We present Infinite-Story, a training-free framework for consistent text-to-image (T2I) generation tailored for multi-prompt storytelling scenarios. Built upon a scale-wise autoregressive model, our method addresses two key challenges in consistent T2I generation: identity inconsistency and style inconsistency. To overcome these issues, we introduce three complementary techniques: Identity Prompt Replacement, which mitigates context bias in text encoders to align identity attributes across prompts; and a unified attention guidance mechanism comprising Adaptive Style Injection and Synchronized Guidance Adaptation, which jointly enforce global style and identity appearance consistency while preserving prompt fidelity. Unlike prior diffusion-based approaches that require fine-tuning or suffer from slow inference, Infinite-Story operates entirely at test time, delivering high identity and style consistency across diverse prompts. Extensive experiments demonstrate that our method achieves state-of-the-art generation performance, while offering over 6× faster inference (1.72 seconds per image) than the existing fastest consistent T2I models, highlighting its effectiveness and practicality for real-world visual storytelling.

## Links

- **Paper:** [arXiv](https://arxiv.org/abs/2511.13002)
- **Project Page:** [https://jihun999.github.io/projects/Infinite-Story/](https://jihun999.github.io/projects/Infinite-Story/)

## Citation

```bibtex
@article{park2025infinite,
  title={Infinite-Story: A Training-Free Consistent Text-to-Image Generation},
  author={Park, Jihun and Lee, Kyoungmin and Gim, Jongmin and Jo, Hyeonseo and Oh, Minseok and Choi, Wonhyeok and Hwang, Kyumin and Kim, Jaeyeul and Choi, Minwoo and Im, Sunghoon},
  journal={arXiv preprint arXiv:2511.13002},
  year={2025}
}
```
