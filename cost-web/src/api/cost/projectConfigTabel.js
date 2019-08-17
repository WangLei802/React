import { post, get } from "@/utils/cost/http";

export function projectConfigList(query_obj) {
  return get("/project/projectConfig/list", query_obj);
}

export function typechange(query_obj) {
  return post("/project/projectConfig/updateIsSuppStatus", query_obj);
}

export function updateIsAssDynaCost(query_obj) {
  return post("/project/projectConfig/updateIsAssDynaCost", query_obj);
}

export function updateIsFinancialSharing(query_obj) {
  return post("/project/projectConfig/updateIsFinancialSharing", query_obj);
}