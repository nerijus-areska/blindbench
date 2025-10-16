# BlindBench  
*A local, human-in-the-loop evaluation lab for language models and agents.*

**This document right now is just a wishlist for v0.1**

## Currently Planned Features
- **MacOS and MLX only in v0.1**
    - if we'll ever get to v0.2, that will get support for other architectures

- **Local model management**  
  - Add models manually from HuggingFace, some parameter auto-detect from model name (possibly meta in HuggingFace)
  - Keeps a small local DB of models and their parameters  

- **Interactive chat sandbox**  
  - Chat with any installed model  
  - Supports system prompts, temperature, max tokens, etc.  
  - Uses [`mlx-lm`](https://github.com/ml-explore/mlx-examples) under the hood on macOS

- **Test creation**  
  - Define a *test* as a list of prompts (and an optional system prompt)  
  - Tests can only be manual (human-scored)

- **Blind evaluation**  
  - Run the same test across multiple models  
  - Blind scoring: you rate outputs without seeing the model identity  
  - Once all samples are rated, the anonymization lifts and statistics are revealed  

- **Offline-first**  
  - Everything runs on your machine; no API calls