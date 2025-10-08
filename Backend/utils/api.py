import requests

def create_embeddings(text_list, model ="bge-m3"):
    r = requests.post("http://localhost:11434/api/embed", json= {
        "model" : model,
        "input": text_list
    })
    return r.json().get('embeddings', [])

def inference(prompt, model ="llama3.2", stream=False):
    r = requests.post("http://localhost:11434/api/generate", json={
        "model": model,
        "prompt": prompt,
        "stream": stream
    })
    return r.json().get('response', '')