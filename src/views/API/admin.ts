import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

// 文章分页列表
export async function getListByCateApi(data: any) {
  const url = `${contextPath}/admin/getList`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 文章详情
export async function getDetailByIdApi(data: any) {
  const Url = `${contextPath}/admin/getDetail`;
  const options = { showLoading: true };
  return get(Url, data, options);
}
// 新增文章
export async function postPageApi(data: any) {
  const url = `${contextPath}/admin/insertItem`;
  const options = { showLoading: false };
  return post(url, data, options);
}
// 删除文章
export async function delApi(data: any) {
  const Url = `${contextPath}/admin/deleteItem`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 更新文章
export async function editPageApi(data: any) {
  const url = `${contextPath}/admin/updateItem`;
  const options = { showLoading: false };
  return post(url, data, options);
}
// 查新文章所有分类
export async function getAdminCateValidApi(data: any) {
  const url = `${contextPath}/admin/getCate`;
  const options = {};
  return get(url, data, options);
}
// 更新文章分类
export async function updateCateApi(data: any) {
  const url = `${contextPath}/admin/updateCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 删除文章分类
export async function delCateApi(data: any) {
  const Url = `${contextPath}/admin/delCate`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 新增文章分类
export async function insertCateApi(data: any) {
  const url = `${contextPath}/admin/insertCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 删除文件
export async function delFileApi(data: any) {
  const url = `${contextPath}/admin/delFile`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 更新用户信息
export async function updateUserInfoApi(data: any) {
  const url = `${contextPath}/account/updateUserInfo`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 获取用户信息
export async function getUserInfoApi(data: any) {
  const url = `${contextPath}/account/getUserInfo`;
  const options = {};
  return get(url, data, options);
}
// 查询所有上传文件
export async function getSourceListApi(data: any) {
  const url = `${contextPath}/admin/getSourceList`;
  const options = {};
  return get(url, data, options);
}
// 查询用户列表
export async function getUserListApi(data: any) {
  const Url = `${contextPath}/admin/getUserList`;
  const options = {};
  return get(Url, data, options);
}
// 查询角色列表
export async function getRoleListApi(data: any) {
  const Url = `${contextPath}/admin/getRoleList`;
  const options = {};
  return post(Url, data, options);
}
// 更新用户角色
export async function updateUserRoleApi(data: any) {
  const Url = `${contextPath}/admin/updateUserRole`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 删除用户
export async function deleUserApi(data: any) {
  const Url = `${contextPath}/admin/deleUser`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 查询站点信息
export async function getSiteInfoApi(data: any) {
  const url = `${contextPath}/admin/getSiteInfo`;
  const options = {};
  return post(url, data, options);
}
// 更新站点信息
export async function updateSiteInfoApi(data: any) {
  const url = `${contextPath}/account/updateSiteInfo`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 发送邮件
export async function sendMailApi(data: any) {
  const url = `${contextPath}/admin/sendMail`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 查询所有评论
export async function getCommentApi(data: any) {
  const url = `${contextPath}/admin/getAllComment`;
  const options = {};
  return post(url, data, options);
}
// 删除评论
export async function delCommentApi(data: any) {
  const url = `${contextPath}/admin/delComment`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 清除redis缓存
export async function clearCacheApi(data: any) {
  const url = `${contextPath}/admin/clearCache`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 新增专题
export async function insertTopicApi(data: any) {
  const url = `${contextPath}/admin/insertTopic`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 查询专题列表
export async function getTopicListApi(data: any) {
  const url = `${contextPath}/admin/getTopicList`;
  const options = {};
  return get(url, data, options);
}
// 添加文章到专题
export async function addPostToTopicApi(data: any) {
  const url = `${contextPath}/admin/addPostToTopic`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 查询专题详情列表
export async function getTopicDetailListApi(data: any) {
  const url = `${contextPath}/admin/getTopicDetailList`;
  const options = {};
  return post(url, data, options);
}
// 更新专题名称
export async function updateTopicApi(data: any) {
  const url = `${contextPath}/admin/updateTopic`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 删除专题
export async function deleteTopicApi(data: any) {
  const Url = `${contextPath}/admin/deleteTopic`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 删除专题文章
export async function deleteTopicDetailApi(data: any) {
  const Url = `${contextPath}/admin/deleteTopicDetail`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 查询回收站所有文章
export async function getPostListByCateApi(data: any) {
  const url = `${contextPath}/admin/getRecycleList`;
  const options = {};
  return post(url, data, options);
}
// 删除文章
export async function deletePostApi(data: any) {
  const Url = `${contextPath}/admin/deletePost`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 查询标签分页列表
export async function getListByTagsApi(data: any) {
  const Url = `${contextPath}/admin/getListByTagsPage`;
  const options = { showLoading: true };
  return get(Url, data, options);
}
// 查询菜单
export async function getMenusApi(data: any) {
  const Url = `${contextPath}/admin/getMenus`;
  const options = { showLoading: true };
  return get(Url, data, options);
}
// 更新角色名称以及对应菜单
export async function updateRoleNameApi(data: any) {
  const Url = `${contextPath}/admin/updateRoleName`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 查询用户角色菜单
export async function getMenuByRoleApi(data: any) {
  const Url = `${contextPath}/admin/getMenuByRole`;
  const options = { showLoading: true };
  return get(Url, data, options);
}
// 更新密码
export async function updatePwdApi(data: any) {
  const Url = `${contextPath}/admin/updatePwd`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 审核评论
export async function approveCommentApi(data: any) {
  const Url = `${contextPath}/admin/approveComment`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 批量删除
export async function batchDelApi(data: any) {
  const Url = `${contextPath}/admin/batchDelPost`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 回收站恢复文章
export async function recoveryPostApi(data: any) {
  const Url = `${contextPath}/admin/recoveryPost`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
