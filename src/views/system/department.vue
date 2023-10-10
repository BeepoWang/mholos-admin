<template>
  <div class="department">
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <p class="text-18px">部门管理</p>
          <el-button type="primary" @click="addDept" v-permission="'system:department:save'"
            >新增部门</el-button
          >
        </div>
      </template>
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        row-key="id"
        default-expand-all
        max-height="calc(100vh - 250px)"
        :tree-props="{ children: 'childNodes', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="部门名称"></el-table-column>
        <el-table-column prop="code" label="部门编码" align="center"></el-table-column>
        <el-table-column prop="sort" label="部门排序" align="center"></el-table-column>
        <el-table-column prop="status" label="部门状态" align="center">
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
                v-permission="'system:department:edit'"
              >
                编辑
              </el-button>
              <el-button
                plain
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
                :icon="Delete"
                v-permission="'system:department:remove'"
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
      <el-form :model="departForm" label-width="100px" ref="departFormRef" :rules="rules">
        <el-form-item label="上级部门" prop="">
          <el-tree-select
            class="w-250px!"
            check-strictly
            clearable
            placeholder="请选择上级部门"
            v-model="departForm.pid"
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
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="departForm.code"
            placeholder="请输入部门编码"
            clearable
            class="w-250px!"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="departForm.name"
            placeholder="请输入部门名称"
            clearable
            class="w-250px!"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门描述" prop="remark">
          <el-input
            type="textarea"
            v-model="departForm.remark"
            placeholder="请输入部门描述"
            clearable
            :autosize="{ minRows: 3, maxRows: 4 }"
            class="w-250px!"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门排序" prop="sort">
          <el-input-number
            v-model="departForm.sort"
            placeholder="请输入部门排序"
            clearable
            class="w-250px!"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-select v-model="departForm.status" placeholder="请选择部门状态" class="w-250px!">
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
  </div>
</template>

<script lang="ts" setup>
import {
  fetchDepartmentList,
  fetchDeleteDepartment,
  fetchUpdateDepartment,
  fetchAddDepartment
} from '@/api/system';
import { getListNameById, statusOptions } from '@/utils/data';
import { clearTreeEmptyChild } from '@/utils/treeHelper';
import { Delete, Edit } from '@element-plus/icons-vue';
import { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';

const tableData = ref<DepartmentItem[]>([] as DepartmentItem[]);
const departmentTreeOptions = ref<DepartmentItem[]>([] as DepartmentItem[]);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);

const getDeptList = async () => {
  const params = {
    name: '',
    status: null,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  };
  const res = await fetchDepartmentList(params);
  if (res.responseCode === 0) {
    tableData.value = res.data.list;
    total.value = res.data.totalNum;

    departmentTreeOptions.value = clearTreeEmptyChild(
      [...res.data.list],
      'childNodes'
    ) as DepartmentItem[];
  }
};
getDeptList();

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getDeptList();
};
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getDeptList();
};

// 删除部门
const handleDelete = (row: any) => {
  console.log(row);
  ElMessageBox.confirm(`您确定要删除部门 --  ${row.name} ？`, `删除部门`, {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const res = await fetchDeleteDepartment({ id: row.id });
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

// 编辑部门
const handleEdit = (row: any) => {
  dialogVisible.value = true;
  dialogTitle.value = '编辑部门';
  departForm.value = row;
};
// 新增部门
const addDept = () => {
  dialogVisible.value = true;
  dialogTitle.value = '新增部门';
};

const dialogVisible = ref(false);
const dialogTitle = ref('新增部门');
const dialogLoading = ref(false);
const departFormRef = ref<FormInstance>();
const departForm = ref<DepartmentItem>({} as DepartmentItem);
const rules = ref<FormRules<Omit<DepartmentItem, 'childNodes'>>>({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入部门编码', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入部门排序', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择部门状态', trigger: ['blur', 'change'] }]
});

const dialogCancel = () => {
  dialogVisible.value = false;
  dialogLoading.value = false;

  departForm.value = {} as DepartmentItem;
};
const dialogConfirm = async () => {
  if (!departFormRef.value) return;
  departFormRef.value.validate(async (valid) => {
    if (!valid) return;
    dialogLoading.value = true;

    if (departForm.value.id) {
      const res = await fetchUpdateDepartment(departForm.value);
      if (res.responseCode === 0) {
        ElMessage({
          type: 'success',
          message: '操作成功'
        });
        handleCurrentChange(1);
        dialogCancel();
      } else {
        dialogLoading.value = false;
      }
    } else {
      const res = await fetchAddDepartment(departForm.value);
      if (res.responseCode === 0) {
        ElMessage({
          type: 'success',
          message: '操作成功'
        });
        handleCurrentChange(1);
        dialogCancel();
      } else {
        dialogLoading.value = false;
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.department {
  padding: 15px;
}
</style>
