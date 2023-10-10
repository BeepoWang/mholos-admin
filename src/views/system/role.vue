<template>
  <div class="role">
    <el-card header="角色管理" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <p class="text-18px">角色管理</p>
          <el-button type="primary" @click="addRole" v-permission="'system:role:save'"
            >新增角色</el-button
          >
        </div>
      </template>
      <el-table border :data="tableData" style="width: 100%" max-height="calc(100vh - 250px)">
        <el-table-column label="角色名称" align="center" prop="name"></el-table-column>
        <el-table-column label="角色编码" align="center" prop="code"></el-table-column>
        <el-table-column label="角色描述" align="center" prop="remark"></el-table-column>
        <el-table-column label="是否默认角色" align="center" prop="defaultFlag">
          <template #default="scope">
            <el-tag :type="scope.row.defaultFlag === 1 ? 'success' : 'danger'">
              {{ scope.row.defaultFlag === 1 ? '默认' : '非默认' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色状态" align="center" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ getListNameById(scope.row.status, statusOptions) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" fixed="right" width="250px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button
                plain
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                :icon="Edit"
                v-permission="'system:role:edit'"
              >
                编辑
              </el-button>
              <el-button
                plain
                type="success"
                size="small"
                @click="handleAuth(scope.row)"
                v-permission="'system:role:permission'"
              >
                <template #icon>
                  <icon-ri-list-settings-fill></icon-ri-list-settings-fill>
                </template>
                权限管理
              </el-button>
              <el-button
                plain
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
                :icon="Delete"
                v-permission="'system:role:remove'"
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
      top="5vh"
      destroy-on-close
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="roleForm"
        ref="roleFormRef"
        class="flex items-center justify-center flex-col"
        :rules="rules"
        label-width="100"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="roleForm.name"
            placeholder="请输入角色名称"
            clearable
            class="w-250px!"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input
            v-model="roleForm.code"
            placeholder="请输入角色编码"
            clearable
            class="w-250px!"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input
            type="textarea"
            v-model="roleForm.remark"
            placeholder="请输入角色描述"
            clearable
            :autosize="{ minRows: 3, maxRows: 4 }"
            class="w-250px!"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色排序" prop="sortNum">
          <el-input-number
            v-model="roleForm.sortNum"
            placeholder="请输入角色排序"
            clearable
            class="w-250px!"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="是否默认角色" prop="defaultFlag">
          <el-select
            v-model="roleForm.defaultFlag"
            placeholder="请选择是否默认角色"
            class="w-250px!"
          >
            <el-option
              v-for="item in defaultRolOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-select v-model="roleForm.status" placeholder="请选择角色状态" class="w-250px!">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCancel">取消</el-button>
          <el-button type="primary" @click="dialogConfirm" :loading="dialogLoading">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogAuthVisible"
      title="设置用户权限"
      class="w-30%! h-85vh! auth-dialog"
      top="5vh"
      destroy-on-close
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="tree-content h-full overflow-scroll">
        <el-tree
          node-key="id"
          ref="authTreeRef"
          check-strictly
          :default-checked-keys="defaultCheckedKeys"
          :data="authTreeOptions"
          :props="{
            label: 'name',
            children: 'childNodes'
          }"
          show-checkbox
          default-expand-all
          @check-change="handleCheckChange"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAuthCancel">取消</el-button>
          <el-button type="primary" @click="dialogAuthConfirm" :loading="dialogAuthLoading"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  fetchRoleList,
  fetchDeleteRole,
  fetchUpdateRole,
  fetchAddRole,
  fetchSaveAuth,
  fetchAuthAllTree
} from '@/api/system';
import { clearTreeEmptyChild } from '@/utils/treeHelper';
import { getListNameById, statusOptions, defaultRolOptions } from '@/utils/data';
import { Delete, Edit } from '@element-plus/icons-vue';
import { FormRules, FormInstance, ElTree } from 'element-plus';

const tableData = ref<RoleListItem[]>([] as RoleListItem[]);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);

const getList = async () => {
  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  };
  const res = await fetchRoleList(params);
  if (res.responseCode === 0) {
    tableData.value = res.data.list;
    total.value = res.data.totalNum;
  }
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getList();
};

onMounted(() => {
  getList();
});

// 删除角色
const handleDelete = (row: RoleListItem) => {
  ElMessageBox.confirm(`您确定要删除角色 --  ${row.name} ？`, `删除角色`, {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const res = await fetchDeleteRole({ id: row.id });
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

// 新增/编辑角色
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogLoading = ref(false);
const roleForm = ref<RoleListItem>({} as RoleListItem);
const roleFormRef = ref<FormInstance>();
const rules = ref<FormRules<RoleListItem>>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择角色状态', trigger: 'blur' }],
  sortNum: [{ required: true, message: '请输入角色排序', trigger: 'blur' }]
});

const handleEdit = (row: RoleListItem) => {
  dialogTitle.value = '编辑角色';
  dialogVisible.value = true;
  roleForm.value = row;
};

const addRole = () => {
  dialogTitle.value = '新增角色';
  dialogVisible.value = true;
};

const dialogCancel = () => {
  dialogVisible.value = false;
  dialogLoading.value = false;
  roleForm.value = {} as RoleListItem;
};

const dialogConfirm = () => {
  if (!roleFormRef.value) return;
  roleFormRef.value.validate(async (valid) => {
    if (!valid) return;
    dialogLoading.value = true;
    if (roleForm.value.id) {
      const res = await fetchUpdateRole(roleForm.value);
      if (res.responseCode === 0) {
        ElMessage({
          type: 'success',
          message: '操作成功'
        });
        dialogVisible.value = false;
        handleCurrentChange(1);
        dialogCancel();
      }
    } else {
      const res = await fetchAddRole(roleForm.value);

      if (res.responseCode === 0) {
        ElMessage({
          type: 'success',
          message: '操作成功'
        });
        dialogVisible.value = false;
        handleCurrentChange(1);
        dialogCancel();
      }
    }
  });
};

// 修改角色权限
const dialogAuthVisible = ref(false);
const dialogAuthLoading = ref(false);
const authTreeOptions = ref();
const authId = ref<string>('');
const authTreeRef = ref<InstanceType<typeof ElTree>>();
const defaultCheckedKeys = ref<string[]>([]);
const getAuthTree = async () => {
  const res = await fetchAuthAllTree();
  if (res.responseCode === 0) {
    authTreeOptions.value = clearTreeEmptyChild([...res.data.list[0].permissions], 'childNodes');
  }
};
onMounted(() => getAuthTree());

const handleCheckChange = () => {
  console.log('handleCheckChange');
};

const handleAuth = (row: RoleListItem) => {
  console.log(row);
  authId.value = row.id;
  defaultCheckedKeys.value = row.rolePermissionList.map((item) => item.id);
  dialogAuthVisible.value = true;
};

const dialogAuthCancel = () => {
  dialogAuthVisible.value = false;
};

const dialogAuthConfirm = async () => {
  dialogAuthVisible.value = false;
  const checkedKeys = authTreeRef.value?.getCheckedKeys() as string[];
  const halfCheckedKeys = authTreeRef.value?.getHalfCheckedKeys() as string[];
  console.log(checkedKeys, halfCheckedKeys);

  const res = await fetchSaveAuth({
    id: authId.value,
    permissionList: checkedKeys
  });
  if (res.responseCode === 0) {
    ElMessage({
      type: 'success',
      message: '操作成功'
    });
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin';

.role {
  padding: 15px;

  .auth-dialog {
    .tree-content {
      @include base-scrollbar;
    }
  }

  ::v-deep(.el-dialog__body) {
    height: 70vh !important;
    padding-top: 10px !important;
    padding-bottom: 0 !important;
  }
}
</style>
