<template>
  <div>
    <el-form
      ref="mallGlobalSetForm"
      :model="mallSetForm"
      :rules="rules"
    >
      <el-form-item
        label="多选平台"
        prop="checkedPlatfroms"
        label-width="100px"
      >
        <el-popover placement="right" width="400" trigger="click">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="checkAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group
            v-model="mallSetForm.checkedPlatfroms"
            class="platform-item"
            @change="checkedPlatformChange"
          >
            <el-checkbox
              v-for="platform in platforms"
              :key="platform.game_id"
              :label="platform.game_id"
            >{{ platform.game_id + "-" + platform.game_name }}</el-checkbox>
          </el-checkbox-group>
          <el-button slot="reference" type="primary">多选平台</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="道具状态" prop="status" label-width="100px">
        <el-switch
          v-model="mallSetForm.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="开启"
          inactive-text="关闭"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="商城页签" prop="page_id" label-width="100px">
        <el-select v-model="mallSetForm.page_id" placeholder="请选择商城页签">
          <el-option
            v-for="item in page_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商城道具" prop="prop_id" label-width="100px">
        <el-select v-model="mallSetForm.prop_id" placeholder="请选择道具">
          <el-option
            v-for="item in propList"
            :key="item.id"
            :label="item.prop_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <p class="addBorder">价格</p>
        <div>
          <el-button @click="addPrice">新增</el-button>
          <el-table :data="configData">
            <el-table-column prop="consume" label="消耗类型">
              <template slot-scope="scoped">
                <el-radio
                  v-model="scoped.row.consume"
                  :label="1"
                  @change="check"
                >金币</el-radio>
                <el-radio
                  v-model="scoped.row.consume"
                  :label="2"
                  @change="check"
                >房卡</el-radio>
                <el-radio
                  v-model="scoped.row.consume"
                  :label="3"
                  @change="check"
                >兑换券</el-radio>
                <el-radio
                  v-model="scoped.row.consume"
                  :label="4"
                  @change="check"
                >钻石</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="consumeNum" label="消耗数量" width="180">
              <template slot-scope="scoped">
                <el-input-number
                  v-model="scoped.row.consumeNum"
                  :min="1"
                  size="small"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="有效期" width="280">
              <template slot-scope="scoped">
                <el-radio
                  v-model="scoped.row.effect"
                  :label="0"
                  @change="showInp(scoped.row)"
                >永久</el-radio>
                <el-radio
                  v-model="scoped.row.effect"
                  :label="1"
                  @change="showInp(scoped.row)"
                >1个月</el-radio>
                <el-radio
                  v-model="scoped.row.effect"
                  :label="3"
                  @change="showInp(scoped.row)"
                >3个月</el-radio>
                <el-radio
                  v-model="scoped.row.effect"
                  :label="6"
                  @change="showInp(scoped.row)"
                >6个月</el-radio>
                <el-radio
                  v-model="scoped.row.effect"
                  :label="12"
                  @change="showInp(scoped.row)"
                >12个月</el-radio>
                <el-radio
                  v-model="scoped.row.effect"
                  :label="5"
                  @change="showInp(scoped.row)"
                >自定义</el-radio>
                <el-input
                  v-if="scoped.row.isDiy"
                  v-model="scoped.row.effect"
                  type="textarea"
                  :rows="1"
                  placeholder="单位: 天"
                  style="width: 34%"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="兑换数量" width="180">
              <template slot-scope="scoped">
                <el-input-number
                  v-model="scoped.row.effectNum"
                  :min="1"
                  size="small"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scoped">
                <i class="el-icon-delete" @click="deleteConfig(scoped)"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <div class="operate-btn">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button
        class="btn-confirm"
        type="primary"
        @click="addConfig"
      >确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currGameId: "",
      isUpdate: false,
      consume: 1,
      effect: 1,
      position: "",
      mallId: "",
      page_type: [
        { value: 1, label: "头像" },
        { value: 2, label: "道具" },
        { value: 3, label: "兑换" },
        { value: 4, label: "钻石" }
      ],
      mallData: [],
      consumeNum: 1,
      propList: [], // 道具列表
      configData: [
        // consume 消耗类型 consumeNum 消耗数量 effect 有效期 effectNum 兑换数量
        // { consume: 1, consumeNum: 100, effect: 1, effectNum: 1 , isDiy: false}
      ],
      mallSetForm: {
        status: true,
        page_id: 1,
        prop_id: "",
        checkedPlatfroms: []
      },
      consumeClassify: [
        { value: 1, label: "头像" },
        { value: 2, label: "道具" },
        { value: 3, label: "" }
      ],
      rules: {
        page_id: [
          { required: true, message: "请选择商城页签", trigger: "change" }
        ],
        prop_id: [{ required: true, message: "请选择道具", trigger: "change" }],
        checkedPlatfroms: [
          { required: true, message: "请选择平台", trigger: "change" }
        ]
      },
      batchOperate: false,
      checkAll: false,
      isIndeterminate: false
    };
  },
  computed: {
    platforms() {
      return this.$store.state.game_list;
    }
  },
  created() {
    this.currGameId = this.$route.params.id;
    this.getPropList();
  },
  methods: {
    checkedPlatformChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.platforms.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.platforms.length;
    },
    checkAllChange(val) {
      const arr = [];
      if (val) {
        this.platforms.forEach(platform => {
          arr.push(platform.game_id);
        });
      }
      this.mallSetForm.checkedPlatfroms = arr;
      this.isIndeterminate = false;
    },
    getPropList() {
      this.$api
        .getPropConfigList({
          game_id: this.currGameId
        })
        .then(res => {
          if (Number(res.data.errno) === 0) {
            console.log(res);
            this.propList = res.data.data;
          }
        })
        .catch(err => {
          throw new Error(err);
        });
    },
    // 增加
    addPrice() {
      this.configData.push({
        consume: 1,
        consumeNum: 1,
        effect: 1,
        effectNum: 1,
        isDiy: false
      });
    },
    addConfig() {
      if (this.configData.length === 0) {
        this.$message({
          type: "warning",
          message: "请配置套餐！"
        });
      }
      const configList = [];
      this.configData.forEach(ele => {
        const configObj = {};
        switch (ele.consume) {
          case 1:
            configObj.coin = ele.consumeNum;
            break;
          case 2:
            configObj.room_card = ele.consumeNum;
            break;
          case 3:
            configObj.exchange = ele.consumeNum;
            break;
          case 4:
            configObj.diamonds = ele.consumeNum;
            break;
          default:
            break;
        }
        configObj.prop_buy_num = ele.effectNum;
        if (ele.isDiy) {
          configObj.prop_buy_day = Number(ele.effect);
        } else {
          switch (ele.effect) {
            case 0:
              configObj.prop_buy_day = 0;
              break;
            case 1:
              configObj.prop_buy_day = ele.effect * 30;
              break;
            case 3:
              configObj.prop_buy_day = ele.effect * 30;
              break;
            case 6:
              configObj.prop_buy_day = ele.effect * 30;
              break;
            case 12:
              configObj.prop_buy_day = ele.effect * 30;
              break;
            default:
              break;
          }
        }
        configList.push(configObj);
      });
      // eslint-disable-next-line
      this.$refs["mallGlobalSetForm"].validate(valid => {
        if (valid) {
          const reqData = {};
          reqData.game_ids = this.mallSetForm.checkedPlatfroms;
          reqData.config = {
            game_id: 1,
            page_type: this.mallSetForm.page_id,
            prop_config_id: this.mallSetForm.prop_id,
            prop_price_meal: configList,
            status: this.mallSetForm.status
          };

          this.addBatch(reqData);
        } else {
          return false;
        }
      });
    },
    async addBatch(condition) {
      try {
        const { data } = await this.$api.mallConfigAddBatch(condition);
        if (Number(data.errno) === 0) {
          this.$message({
            type: "success",
            message: "批量增加成功！"
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
          message: `批量添加失败！${error}`
        });
      }
    },
    deleteConfig(row) {
      // eslint-disable-next-line
      this.$confirm("确认删除？")
        .then(() => {
          this.configData.splice(row.$index, 1);
          // eslint-disable-next-line
        })
        .catch(n => {
          console.log(n);
        });
    },
    // 重置数据
    resetData() {
      this.$refs.mallGlobalSetForm.resetFields();
      this.configData = [];
    },
    showInp(row) {
      if (row.effect === 5) {
        row.isDiy = true;
      }
    },
    closeDialog(hadChange) {
      this.$emit("closeDialog", hadChange);
    },
    // 金币与房卡在同一套餐不能出现
    check() {
      // this.configData.forEach((ele) => {
      // })
    }
  }
};
</script>

<style lang="scss" scoped>
.el-radio + .el-radio {
  margin-left: 0;
}

.el-checkbox {
  margin: 0 0 5px 0;
  width: 130px;
}

.platform-item {
  max-height: 250px;
  overflow: scroll;
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
