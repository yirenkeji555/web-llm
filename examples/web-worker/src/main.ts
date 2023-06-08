import * as webllm from "@mlc-ai/web-llm";

function setLabel(id: string, text: string) {
  const label = document.getElementById(id);
  if (label == null) {
    throw Error("Cannot find label " + id);
  }
  label.innerText = text;
}

async function main() {
  // Use a chat worker client instead of ChatModule here
  const chat = new webllm.ChatWorkerClient(new Worker(
    new URL('./worker.ts', import.meta.url),
    {type: 'module'}
  ));

  chat.setInitProgressCallback((report: webllm.InitProgressReport) => {
    setLabel("init-label", report.text);
  });

  await chat.reload("RedPajama-INCITE-Chat-3B-v1-q4f32_0");

  const generateProgressCallback = (_step: number, message: string) => {
    setLabel("generate-label", message);
  };

  const prompt0 = "What is the capital of Canada?";
  setLabel("prompt-label", prompt0);
  const reply0 = await chat.generate(prompt0, generateProgressCallback);
  console.log(reply0);

  const prompt1 = "Can you write a poem about it?";
  setLabel("prompt-label", prompt1);
  const reply1 = await chat.generate(prompt1, generateProgressCallback);
  console.log(reply1);

  console.log(await chat.runtimeStatsText());
}

main();
