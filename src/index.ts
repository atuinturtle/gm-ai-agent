import { SetApiClient } from "./SetApiClient";

const client = new SetApiClient();

client.callSetEndpoint({
  "messages": [{ "role": "user", "content": "Hello, world!" }]
});