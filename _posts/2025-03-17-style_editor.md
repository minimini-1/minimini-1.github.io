---
title: "Style-Editor: Text-driven object-centric style editing"
description: Conference on Computer Vision and Pattern Recognition (CVPR), Jun 2025
author: JiHun Park*, <strong>Jongmin Gim*</strong>, Kyoungmin Lee*, Seunghun Lee, and Sunghoon Im.
categories: publications
date: 2025-03-14
pin: false
math: true
mermaid: true
image:
  path: /assets/img/post_images/style_editor.png
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: Style-Editor
---

## Abstract

We present Text-driven object-centric style editing model named Style-Editor, a novel method that guides style editing at an object-centric level using textual inputs.The core of Style-Editor is our Patch-wise Co-Directional (PCD) loss, meticulously designed for precise object-centric editing that are closely aligned with the input text. This loss combines a patch directional loss for text-guided style direction and a patch distribution consistency loss for even CLIP embedding distribution across object regions. It ensures a seamless and harmonious style editing across object regions.Key to our method are the Text-Matched Patch Selection (TMPS) and Pre-fixed Region Selection (PRS) modules for identifying object locations via text, eliminating the need for segmentation masks. Lastly, we introduce an Adaptive Background Preservation (ABP) loss to maintain the original style and structural essence of the image's background. This loss is applied to dynamically identified background areas.Extensive experiments underline the effectiveness of our approach in creating visually coherent and textually aligned style editing.

## Links

- **Paper:** [CVPR 2025](https://openaccess.thecvf.com/content/CVPR2025/html/Park_Style-Editor_Text-driven_Object-centric_Style_Editing_CVPR_2025_paper.html)
- **Project Page:** [Style-Editor](https://jihun999.github.io/projects/Style-Editor/)

## Citation

```bibtex
@inproceedings{park2025styleeditor,
  title={Style-Editor: Text-driven object-centric style editing},
  author={Park, JiHun and Gim, Jongmin and Lee, Kyoungmin and Lee, Seunghun and Im, Sunghoon},
  booktitle={Conference on Computer Vision and Pattern Recognition (CVPR)},
  year={2025}
}
```