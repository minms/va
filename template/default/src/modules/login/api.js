import {VaHttp} from "va-core"

export function login(form) {
  return VaHttp.post('/admin/login/login', form);
}