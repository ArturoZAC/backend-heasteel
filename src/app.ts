import { envs } from "./config/envs";
import { AppRoute } from "./presentation/appRoute";
import { AppServer } from "./presentation/appServer";

(() => {
  App();
})();

function App() {
  const server = new AppServer(envs.PORT, AppRoute.routes());
  server.start();
}
