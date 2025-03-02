import {$log, AfterListen, Constant, InjectorService, Module, OnDestroy, Provider} from "@tsed/common";
import {catchError, nameOf} from "@tsed/core";
import {Server, ServerOptions} from "socket.io";
import {SocketProviderMetadata} from "./class/SocketProviderMetadata"; // tslint:disable-line: no-unused-variable
import {PROVIDER_TYPE_SOCKET_SERVICE} from "./constants/constants";
import {IO} from "./decorators/io";
import {SocketIOService} from "./services/SocketIOService";
import Http from "http";
import Https from "https";
import {Inject} from "@tsed/di";

/**
 * @ignore
 */
@Module()
export class SocketIOModule implements AfterListen, OnDestroy {
  @Constant("logger.disableRoutesSummary", false)
  protected disableRoutesSummary: boolean;

  @Constant("socketIO", {})
  protected settings: Partial<ServerOptions>;

  @Inject()
  protected injector: InjectorService;

  @Inject(Http.Server)
  protected httpServer: Http.Server | null;

  @Inject(Https.Server)
  protected httpsServer: Https.Server | null;

  @IO()
  private io: Server;

  @Inject()
  private socketIOService: SocketIOService;

  $afterListen() {
    if (this.httpServer) {
      this.io.attach(this.httpServer, {...this.settings});
    }

    if (this.httpsServer) {
      this.io.attach(this.httpsServer, {...this.settings});
    }

    if (this.settings.adapter) {
      this.io.adapter(this.settings.adapter);
    }

    this.getWebsocketServices().forEach((provider) => this.socketIOService.addSocketProvider(provider));

    if (!this.disableRoutesSummary) {
      this.printSocketEvents();
    }

    return this.injector.emit("$afterSocketListen");
  }

  $onDestroy() {
    catchError(() => this.io.close());
  }

  /**
   *
   * @returns {Provider<any>[]}
   */
  protected getWebsocketServices(): Provider<any>[] {
    return Array.from(this.injector.getProviders(PROVIDER_TYPE_SOCKET_SERVICE));
  }

  /**
   *
   */
  protected printSocketEvents() {
    const list = this.getWebsocketServices().reduce((acc: any[], provider) => {
      const socketProvider = new SocketProviderMetadata(provider.store.get("socketIO"));

      if (socketProvider.namespace) {
        socketProvider.getHandlers().forEach((handler) => {
          acc.push({
            namespace: socketProvider.namespace,
            inputEvent: handler.eventName,
            outputEvent: (handler.returns && handler.returns.eventName) || "",
            outputType: (handler.returns && handler.returns.type) || "",
            name: `${nameOf(provider.useClass)}.${handler.methodClassName}`
          });
        });
      }

      return acc;
    }, []);

    this.injector.logger.info("Socket events mounted:");

    const str = $log.drawTable(list, {
      padding: 1,
      header: {
        namespace: "Namespace",
        inputEvent: "Input event",
        outputEvent: "Output event",
        outputType: "Output type",
        name: "Class method"
      }
    });

    this.injector.logger.info("\n" + str.trim());

    this.injector.logger.info("Socket server started...");
  }
}
