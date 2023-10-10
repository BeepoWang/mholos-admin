<template>
  <div class="menu">
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <p class="text-18px">菜单管理</p>
          <el-button type="primary" @click="addMenu" v-permission="'system:menu:add'"
            >新增菜单</el-button
          >
        </div>
      </template>
      <div class="flex justify-between">
        <el-table
          border
          :data="tableData"
          style="width: 100%"
          row-key="id"
          default-expand-all
          :stripe="false"
          max-height="calc(100vh - 200px)"
          :tree-props="{ children: 'childNodes', hasChildren: 'hasChildren' }"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="name" label="菜单名称" width="200px"></el-table-column>
          <el-table-column
            align="center"
            prop="icon"
            label="菜单图标"
            width="100px"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-icon size="18px">
                <component :is="iconRender({ icon: scope.row.icon })"></component>
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column
            prop="code"
            label="菜单编码"
            align="center"
            width="180px"
          ></el-table-column>
          <el-table-column prop="component" align="center" label="菜单组件" width="150px">
            <template #default="scope">
              <span>
                {{ scope.row.component ? scope.row.component : '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="url"
            label="菜单路由"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="sortNum" align="center" label="菜单排序" width="120px">
            <template #default="scope">
              <span>
                {{ scope.row.sortNum ? scope.row.sortNum : '--' }}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="" label="操作" align="center" fixed="right" width="260px">
            <template #default="scope">
              <div class="flex items-center justify-start">
                <el-button
                  plain
                  type="primary"
                  size="small"
                  @click="handleEdit(scope.row)"
                  :icon="Edit"
                  v-permission="'system:menu:edit'"
                >
                  编辑
                </el-button>

                <el-button
                  plain
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  :icon="Delete"
                  v-permission="'system:menu:delete'"
                >
                  删除
                </el-button>
                <el-button
                  plain
                  type="success"
                  size="small"
                  v-show="scope.row.type !== 'M'"
                  @click="handleButton(scope.row)"
                  v-permission="'system:menu:btn'"
                >
                  <template #icon>
                    <icon-ri-list-settings-fill></icon-ri-list-settings-fill>
                  </template>
                  按钮设置
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
      <el-form modal="menuInfo" label-width="120px" label-position="left">
        <el-form-item label="父级菜单">
          <el-tree-select
            class="w-full!"
            check-strictly
            clearable
            placeholder="请选择上级部门"
            v-model="menuInfo.pid"
            :data="tableData"
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
        <el-form-item label="名称">
          <el-input v-model="menuInfo.name" placeholder="请输入菜单名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="menuInfo.code" placeholder="请输入菜单编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="menuInfo.component" placeholder="请输入菜单组件" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            class="w-full!"
            v-model="menuInfo.sortNum"
            placeholder="请输入菜单排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item label="图标">
          <div flex items-center w-full justify-between>
            <el-input
              class="w-85%!"
              v-model="menuInfo.icon"
              placeholder="请输入菜单图标"
              clearable
            ></el-input>
            <el-icon size="22px" class="w-15%">
              <component :is="iconRender({ icon: menuInfo.icon })"></component>
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item label="路由">
          <el-input v-model="menuInfo.url" placeholder="请输入页面路由" clearable></el-input>
        </el-form-item>
        <el-form-item label="侧边栏展示">
          <el-switch
            v-model="menuInfo.display"
            :active-value="1"
            active-text="展示"
            inactive-text="隐藏"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            v-model="menuInfo.remark"
            placeholder="请输入说明"
            type="textarea"
            :autosize="{
              minRows: 2,
              maxRows: 4
            }"
          ></el-input>
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
      v-model="dialogBtnVisible"
      title="按钮设置"
      class="w-50%!"
      top="5vh"
      :show-close="false"
      destroy-on-close
    >
      <template #header>
        <div flex justify-between p-10px>
          <p text-20px>{{ buttonList.name }} -- 按钮设置</p>
          <el-button type="primary" @click="addButton">新增页面按钮</el-button>
        </div>
      </template>
      <div pb-25px>
        <el-table border :data="buttonTableData">
          <el-table-column
            align="center"
            prop="name"
            label="按钮名称"
            width="120px"
          ></el-table-column>
          <el-table-column align="center" prop="code" label="按钮编码"></el-table-column>
          <el-table-column align="center" prop="remark" label="按钮说明"></el-table-column>

          <el-table-column prop="" label="操作" align="center" fixed="right" width="180px">
            <template #default="scope">
              <div class="flex items-center justify-start">
                <el-button
                  plain
                  type="primary"
                  size="small"
                  @click="handleBtnEdit(scope.row)"
                  :icon="Edit"
                  v-permission="'system:menu:btn:edit'"
                >
                  编辑
                </el-button>

                <el-button
                  plain
                  size="small"
                  type="danger"
                  @click="handleBtnDelete(scope.row)"
                  :icon="Delete"
                  v-permission="'system:menu:btn:delete'"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="showAddForm"></div>
      </div>
    </el-dialog>

    <el-dialog v-model="showAddForm" :title="addFormTitle" class="w-30%!">
      <el-form :modal="buttonForm" label-width="80px">
        <el-form-item label="按钮名称">
          <el-input
            v-model="buttonForm.name"
            class="w-230px!"
            placeholder="请输入按钮名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="按钮编码">
          <el-input
            v-model="buttonForm.code"
            class="w-230px!"
            placeholder="请输入按钮编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="按钮说明">
          <el-input
            v-model="buttonForm.remark"
            class="w-230px!"
            placeholder="请输入按钮说明"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            class="w-230px!"
            v-model="buttonForm.sortNum"
            placeholder="请输入排序"
            clearable
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { fetchMenuList, fetchDeleteMenu, fetchAddMenu, fetchUpdateMenu } from '@/api/system';
import { findChildNode, generateNewTree } from '@/utils/treeHelper';
import { useIconRender } from '@/hooks/useIconRender';
import { Edit, Delete } from '@element-plus/icons-vue';

const { iconRender } = useIconRender();

const menuList = ref<MenuItem[]>([]);
const tableData = ref<MenuItem[]>([]);
const getMenuList = async () => {
  const res = await fetchMenuList();
  if (res.responseCode === 0) {
    menuList.value = res.data.list;
    tableData.value = generateNewTree(res.data.list) as MenuItem[];
  }
};
const tableRowClassName = ({ row }: { row: MenuItem }) => {
  if (row.type === 'M') {
    return 'bg-#F5F7FA!';
  }
  return '';
};
getMenuList();

watch(
  () => menuList.value,
  (val) => {
    tableData.value = generateNewTree(val) as MenuItem[];
  }
);

// 删除菜单
const handleDelete = (row: MenuItem) => {
  console.log('handleDelete', row);
  ElMessageBox.confirm(`您确定要删除菜单 --  ${row.name} ？`, `删除角色`, {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const res = await fetchDeleteMenu({ id: row.id as string });
      if (res.responseCode === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        });
        getMenuList();
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

// 菜单新增/修改
const dialogVisible = ref<boolean>(false);
const dialogLoading = ref<boolean>(false);
const dialogTitle = ref<string>('新增菜单');
const menuInfo = ref<MenuItem>({} as MenuItem);

const handleEdit = (row: MenuItem) => {
  console.log('handleEdit', row);
  dialogVisible.value = true;
  menuInfo.value = row;
};

const addMenu = () => {
  console.log('addMenu');
  dialogVisible.value = true;
};

const dialogCancel = () => {
  console.log('dialogCancel');
  dialogVisible.value = false;
  dialogLoading.value = false;
  menuInfo.value = {} as MenuItem;
};

const dialogConfirm = async () => {
  console.log('dialogConfirm');
  if (menuInfo.value.id) {
    // 编辑
    const res = await fetchUpdateMenu(menuInfo.value);
    if (res.responseCode === 0) {
      ElMessage({
        type: 'success',
        message: '编辑成功'
      });
      getMenuList();
      dialogCancel();
    }
  } else {
    // 新增
    const res = await fetchAddMenu(menuInfo.value);
    if (res.responseCode === 0) {
      ElMessage({
        type: 'success',
        message: '新增成功'
      });
      getMenuList();
      dialogCancel();
    }
  }
};

// 按钮新增/修改
const dialogBtnVisible = ref(false);
const buttonTableData = ref<MenuItem[]>([] as MenuItem[]);
const buttonList = ref<MenuItem>({} as MenuItem);
const handleButton = (row: MenuItem) => {
  buttonList.value = findChildNode(menuList.value, row.id);
  buttonTableData.value = buttonList.value.childNodes;
  dialogBtnVisible.value = true;
};

const showAddForm = ref(false);
const addFormTitle = ref('');
const buttonForm = ref<MenuItem>({} as MenuItem);
const addButton = () => {
  addFormTitle.value = `新增 ${buttonList.value.name} 按钮信息`;
  // buttonForm.value = {
  //   ...buttonTableData.value[0],
  //   code: '',
  //   name: '',
  //   id: '',
  //   remark: '',
  //   childNodes: []
  // }
  showAddForm.value = true;
};

const handleBtnDelete = (row: MenuItem) => {
  console.log(row);
  ElMessageBox.confirm(`您确定要删除${buttonList.value.name} --  ${row.name} 按钮？`, `删除角色`, {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const res = await fetchDeleteMenu({ id: row.id as string });
      if (res.responseCode === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        });
        buttonTableData.value = buttonList.value.childNodes.filter((item) => item.id !== row.id);
        getMenuList();
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

const handleBtnEdit = (row: MenuItem) => {
  addFormTitle.value = `新增 ${buttonList.value.name} 按钮信息`;
  showAddForm.value = true;
  buttonForm.value = row;
};

const cancel = () => {
  showAddForm.value = false;
  buttonForm.value = {} as MenuItem;
};

const confirm = async () => {
  console.log('confirm');
  buttonForm.value.pid = buttonList.value.id;
  buttonForm.value.display = 1;
  if (buttonForm.value.id) {
    // 编辑
    const res = await fetchUpdateMenu(buttonForm.value);
    if (res.responseCode === 0) {
      ElMessage({
        type: 'success',
        message: '编辑成功'
      });
      getMenuList();
      cancel();
    }
  } else {
    // 新增
    const res = await fetchAddMenu(buttonForm.value);
    if (res.responseCode === 0) {
      ElMessage({
        type: 'success',
        message: '新增成功'
      });
      buttonForm.value.id = res.data.id;
      buttonList.value.childNodes.push(buttonForm.value);
      getMenuList();
      cancel();
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  padding: 15px;

  ::v-deep(.el-dialog__body) {
    padding-top: 10px !important;
    padding-bottom: 0 !important;
  }
}
</style>
