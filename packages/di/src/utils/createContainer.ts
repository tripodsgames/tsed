import {Container} from "../domain/Container";
import {GlobalProviders} from "../registries/GlobalProviders";

export function createContainer() {
  return new Container(GlobalProviders.entries());
}
