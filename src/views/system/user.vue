<template>
  <div class="user">
    <el-card header="用户管理" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <p class="text-18px">用户管理</p>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" max-height="calc(100vh - 250px)">
        <el-table-column prop="avatar" label="头像" align="center" width="120">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" align="center" width="200" />
        <el-table-column prop="name" label="用户名" align="center" width="120" />
        <el-table-column prop="email" label="邮箱" align="center" width="240" />
        <el-table-column prop="status" label="是否禁用" align="center" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ getListNameById(scope.row.status, statusOptions) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userRoleList" label="角色" align="center" width="260">
          <template #default="scope">
            <template v-if="scope.row.userRoleList.length > 0">
              <el-tag v-for="role in scope.row.userRoleList" :key="role.id">
                {{ role.name }}
              </el-tag>
            </template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="部门" align="center" width="100" />
        <el-table-column prop="" label="操作" align="center" fixed="right" width="250px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button
                plain
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                :icon="Edit"
                v-permission="'system:user:edit'"
              >
                编辑
              </el-button>
              <el-button
                plain
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
                :icon="Delete"
                v-permission="'system:user:remove'"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end items-center p-10px w-full mt-10px">
        <el-pagination
          v-model:current-page="pageNum"
          :page-size="pageSize"
          layout="total,sizes,prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="Number(total)"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      class="w-30%!"
      destroy-on-close
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="100px">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userInfo.email"
            disabled
            placeholder="请输入邮箱"
            clearable
            class="w-250px!"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input
            v-model="userInfo.name"
            placeholder="请输入用户名"
            clearable
            class="w-250px!"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户状态" prop="name">
          <el-select v-model="userInfo.status" placeholder="请选择用户状态" class="w-250px!">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="name">
          <el-tree-select
            class="w-250px!"
            check-strictly
            v-model="userInfo.departmentId"
            :data="departmentTreeOptions"
            :props="{
              children: 'childNodes',
              label: 'name',
              value: 'id'
            }"
          >
            <template #default="{ data: { name } }">
              {{ name }}
              <span style="color: gray"></span>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item label="角色" prop="name">
          <el-select
            class="w-250px!"
            v-model="userInfo.roleIds"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCancel">取消</el-button>
          <el-button type="primary" @click="dialogConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Edit, Delete } from '@element-plus/icons-vue';
import {
  fetchUserList,
  fetchDeleteUser,
  fetchAllRole,
  fetchDepartmentList,
  fetchUpdateUser
} from '@/api/system';
import { getListNameById, statusOptions } from '@/utils/data';
import { clearTreeEmptyChild } from '@/utils/treeHelper';
import { ElMessage, ElMessageBox } from 'element-plus';

const tableData = ref<UserItem[]>([] as UserItem[]);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);

const getUserList = async () => {
  const res = await fetchUserList({
    pageNum: pageNum.value,
    pageSize: pageSize.value
  });
  if (res.responseCode === 0) {
    tableData.value = res.data.list;
    total.value = res.data.totalNum;
  } else {
    ElMessage.error(res.responseMessage);
  }
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getUserList();
};

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getUserList();
};

onMounted(() => {
  getUserList();
});

// 删除用户
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`您确定要删除用户 --  ${row.name} ？`, `删除用户`, {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const res = await fetchDeleteUser({ userId: row.id });
      if (res.responseCode === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        });
        handleCurrentChange(1);
      } else {
        ElMessage({
          type: 'error',
          message: res.responseMessage
        });
      }
    })
    .catch(() => {
      console.log('cancel');
    });
};

// 编辑用户
const handleEdit = (row: any) => {
  console.log(row);
  dialogVisible.value = true;
  userInfo.value = row;
  userInfo.value.roleIds = row.userRoleList.map((item: any) => item.id);
};

const dialogVisible = ref(false);
const dialogTitle = ref('修改用户信息');
const userInfo = ref<UserItem & { roleIds: string[] }>({} as UserItem & { roleIds: string[] });

const dialogCancel = () => {
  dialogVisible.value = false;
};

const dialogConfirm = async () => {
  const params = {
    id: userInfo.value.id,
    name: userInfo.value.name,
    status: userInfo.value.status,
    departmentId: userInfo.value.departmentId,
    roleList: userInfo.value.roleIds
  };
  const res = await fetchUpdateUser(params);
  if (res.responseCode === 0) {
    ElMessage({
      type: 'success',
      message: '修改成功'
    });
    dialogVisible.value = false;
    getUserList();
  } else {
    ElMessage({
      type: 'error',
      message: res.responseMessage
    });
  }
};

const roleList = ref<RoleItem[]>([] as RoleItem[]);
const getRoleList = async () => {
  const res = await fetchAllRole();
  if (res.responseCode === 0) {
    roleList.value = res.data.list[0].roles;
  }
};
getRoleList();

const departmentTreeOptions = ref<DepartmentItem[]>([] as DepartmentItem[]);
const getDepartList = async () => {
  const params = { name: '', status: 0 };
  const res = await fetchDepartmentList(params);
  if (res.responseCode === 0) {
    departmentTreeOptions.value = clearTreeEmptyChild(
      [...res.data.list],
      'childNodes'
    ) as DepartmentItem[];
  }
};
getDepartList();
</script>

<style lang="scss" scoped>
.user {
  height: 100%;
  padding: 15px;
}
</style>
