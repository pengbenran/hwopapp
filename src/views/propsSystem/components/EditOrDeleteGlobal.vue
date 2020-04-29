<template>
  <div class="wrapper">
    <div class="prop-name">
      <p>道具名称</p>
      <p>
        <el-select v-model="prop_id" placeholder="请选择道具">
          <el-option
            v-for="item in propList"
            :key="item.id"
            :label="item.prop_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
    </div>
    <div class="has-platform">
      <p>
        配有该道具的平台(<span style="color: #ff0000;">平台过多可滚动查看</span>)
      </p>
      <p>
        <el-table
          :data="platforms"
          border
          class="platfrom-table"
          style="width: 100%; max-height: 300px; overflow: scroll;"
        >
          <el-table-column prop="propName" label="道具名称" align="center">
          </el-table-column>
          <el-table-column prop="platName" label="平台" align="center">
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.status ? "开启" : "关闭" }}
              <el-switch
                v-model="scope.row.status"
                disabled
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </p>
    </div>
    <div v-if="wayName === 'edit'" class="prop-status">
      <p>状态</p>
      <el-switch
        v-model="propStatus"
        style="display: block"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="开"
        inactive-text="关"
      >
      </el-switch>
    </div>
    <div class="operate-btn">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button
        class="btn-confirm"
        type="primary"
        :disabled="cantOperate"
        @click="updateOrDeleteConfig"
      >确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wayName: {
      type: String,
      default: "edit"
    }
  },
  data() {
    return {
      prop_id: "",
      propList: [],
      propName: "",
      defaultPlatformIds: [],
      platforms: [],
      allPlatforms: {},
      propStatus: false,
      cantOperate: true
    };
  },
  watch: {
    prop_id(newV, oldV) {
      if (newV === oldV || typeof newV !== typeof 0) {
        return;
      }
      const p = this.propList.find(prop => prop.id === newV);
      this.propName = p.prop_name;
      this.getHadPropPlatforms(newV, p.prop_name);
    }
  },
  created() {
    this.gameId = this.$route.params.id;
    this.allPlatforms = this.$store.state.game_list_obj;
    this.getPropList();
  },
  methods: {
    async getPropList() {
      try {
        const { data } = await this.$api.getPropConfigList(this.gameId);
        if (Number(data.errno) === 0) {
          this.propList = data.data;
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: `获取道具失败！${error}`
        });
      }
    },
    async getHadPropPlatforms(propId, propName) {
      const loading = this.$loading({
        target: ".platfrom-table",
        text: "搜索平台中..."
      });
      this.cantOperate = true;
      try {
        const { data } = await this.$api.mallPlatformQuery(propId);
        if (Number(data.errno) === 0) {
          if (data.data && data.data.length !== 0) this.cantOperate = false;
          this.getPlatformId(data.data);
          this.formPlatforms(data.data, propName);
        } else {
          this.$message({
            type: "error",
            message: data.errmsg
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: `查询平台失败！${error}`
        });
      } finally {
        loading.close();
      }
    },
    getPlatformId(plats) {
      const platIds = [];
      plats.forEach(plat => platIds.push(plat.game_id));
      this.defaultPlatformIds = platIds;
    },
    formPlatforms(plats, propName) {
      this.propStatus = false;
      const platform = [];
      plats.forEach(p => {
        if (!this.propStatus && p.status) {
          // 当配有该道具的平台有开启状态时，道具默认状态为开启
          this.propStatus = true;
        }
        const plat = this.allPlatforms[p.game_id];
        platform.push({
          propName,
          platName: `${plat.game_id}-${plat.game_name}`,
          status: p.status
        });
      });
      this.platforms = platform;
    },
    async updateBatch() {
      try {
        const { data } = await this.$api.mallConfigUpdateBatch(
          this.prop_id,
          this.defaultPlatformIds,
          this.propStatus
        );
        if (Number(data.errno) === 0) {
          this.$message({
            type: "success",
            message: "批量修改道具状态成功！"
          });
          this.closeDialog(true);
        } else {
          this.$message({
            type: "error",
            message: data.errmsg
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: `批量修改道具失败！${error}`
        });
      }
    },
    async deleteBatch() {
      try {
        const { data } = await this.$api.mallConfigDeleteBatch(
          this.prop_id,
          this.defaultPlatformIds
        );
        if (Number(data.errno) === 0) {
          this.$message({
            type: "success",
            message: "批量删除道具状态成功！"
          });
          this.closeDialog(true);
        } else {
          this.$message({
            type: "error",
            message: data.errmsg
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: `批量删除道具失败！${error}`
        });
      }
    },
    updateOrDeleteConfig() {
      this.$confirm(
        `将各平台【${this.propName}】${
          this.wayName === "edit" ? "的状态进行修改？" : "删除？"
        }`
      )
        .then(y => {
          console.log(y);
          if (this.wayName === "edit") {
            this.updateBatch();
          } else {
            this.deleteBatch();
          }
        })
        .catch(n => {
          console.log(n);
        });
    },
    closeDialog(hadChange) {
      this.$emit("closeDialog", hadChange);
    },
    resetData() {
      // 将各参数重置
      this.prop_id = "";
      this.propName = "";
      this.defaultPlatformIds = [];
      this.platforms = [];
      this.propStatus = false;
      this.cantOperate = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  // margin-bottom: 80px;
  .prop-name {
    max-width: 200px;
  }

  .el-checkbox {
    margin: 0 0 5px 0;
    width: 130px;
  }

  .has-platform {
    margin: 40px 0;
  }
}

.operate-btn {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  button:first-child {
    margin-right: 40px;
  }
}
</style>
