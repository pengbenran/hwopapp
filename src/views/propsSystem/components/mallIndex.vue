<template>
  <div>
    <div>
      <el-button class="addProp" type="primary" @click="addProp">新增道具</el-button>
      <el-button
        v-if="$store.state.isAllGamePlatform && $store.state.isShowInVuex[1]"
        class="batch-operate"
        type="primary"
        @click="batchOperate = true"
      >批量操作</el-button>
      <el-dialog
        title="商城配置"
        width="1024px"
        :visible.sync="mallSetDialog"
        @close="resetData('mallSetForm')"
      >
        <el-form ref="mallSetForm" :model="mallSetForm" :rules="rules">
          <el-form-item label="道具状态" prop="status" label-width="100px">
            <el-switch
              v-model="mallSetForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>
          <el-form-item label="商城页签" prop="page_id" label-width="100px">
            <el-select
              v-model="mallSetForm.page_id"
              placeholder="请选择商城页签"
            >
              <el-option
                v-for="item in page_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商城道具" prop="prop_id" label-width="100px">
            <el-select v-model="mallSetForm.prop_id" placeholder="请选择道具">
              <el-option
                v-for="item in propList"
                :key="item.id"
                :label="item.prop_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <p class="addBorder">价格</p>
            <div>
              <!-- <div>
                <span class="consume"> 消耗类型</span>
                <el-radio v-model="consume" :label="1" size="small" border>金币</el-radio>
                <el-radio v-model="consume" :label="2" size="small" border>房卡</el-radio>
                <el-radio v-model="consume" :label="3" size="small" border>兑换券</el-radio>
                <el-button @click="addPrice" style="float:right">新增</el-button>
              </div> -->
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
                    />
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
        <div slot="footer" class="dialog-footer">
          <el-button @click="mallSetDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addPropConfig('mallSetForm')"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-table :data="mallData">
        <el-table-column
          align="center"
          prop="prop_config_id"
          label="商城道具"
          width="200"
        >
          <template slot-scope="scoped">
            <span>{{ getPropName(scoped.row.prop_config_id) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="page_type"
          label="商城页签"
          width="200"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.page_type === 1">头像</span>
            <span v-if="scoped.row.page_type === 2">道具</span>
            <span v-if="scoped.row.page_type === 3">兑换券</span>
            <span v-if="scoped.row.page_type === 4">钻石</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="prop_price_meal" label="套餐详情">
          <template slot-scope="scoped">
            <el-table :data="scoped.row.prop_price_meal">
              <el-table-column align="center" label="消耗">
                <template v-slot="scoped">
                  <span>{{ consumeType(scoped.row) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="prop_buy_day"
                label="有效期"
              >
                <template v-slot="scoped">
                  <span v-if="Number(scoped.row.prop_buy_day) === 0">永久</span>
                  <span v-else>{{ scoped.row.prop_buy_day + "天" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="prop_buy_num"
                label="数量"
              />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="200">
          <template slot-scope="scoped">
            <span v-if="scoped.row.status" style="color: green;">开启</span>
            <span v-else style="color: red;">关闭</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scoped">
            <el-button type="primary" @click="edit(scoped.row)">编辑</el-button>
            <el-button
              type="danger"
              @click="deletePropConfig(scoped.row)"
            >删除</el-button>
            <span
              class="gold-game-change-index"
              title="向上移"
              @click="positionUp(scoped.row, scoped.$index)"
            ><i
              class="el-icon-d-arrow-left"
            /></span>
            <span
              class="gold-game-change-index"
              title="向下移"
              @click="positionDown(scoped.row, scoped.$index)"
            >
              <i
                class="el-icon-d-arrow-right"
              /></span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="batchTabName"
        title="批量操作"
        :visible.sync="batchOperate"
        width="50%"
        @close="resetTabData"
      >
        <el-tabs v-model="batchTabName">
          <el-tab-pane label="新增" name="addGlobal">
            <AddGlobal
              ref="addGlobal"
              @closeDialog="closeBatchDialog"
            ></AddGlobal>
          </el-tab-pane>
          <el-tab-pane label="编辑" name="editGlobal">
            <EditGlobal
              ref="editGlobal"
              way-name="edit"
              @closeDialog="closeBatchDialog"
            ></EditGlobal>
          </el-tab-pane>
          <el-tab-pane way-name="delete" label="删除" name="deleteGlobal">
            <DeleteGlobal
              ref="deleteGlobal"
              @closeDialog="closeBatchDialog"
            ></DeleteGlobal>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import AddGlobal from "./AddGlobal";
import EditGlobal from "./EditOrDeleteGlobal";
import DeleteGlobal from "./EditOrDeleteGlobal";
export default {
  components: {
    AddGlobal,
    EditGlobal,
    DeleteGlobal
  },
  data() {
    return {
      currGameId: "",
      isUpdate: false,
      mallSetDialog: false,
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
        // { consume: 1, consumeNum: 100, effect: 1, effectNum: 1 , isDiy: false},
        // { consume: 2, consumeNum: 10, effect: 3, effectNum: 1 , isDiy: false},
      ],
      mallSetForm: {
        status: true,
        page_id: 1,
        prop_id: ""
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
        prop_id: [{ required: true, message: "请选择道具", trigger: "change" }]
      },
      batchOperate: false,
      batchTabName: "addGlobal"
    };
  },
  created() {
    // this.$store.commit({
    //   type: 'getCurrGameId',
    //   id: this.$route.params.id,
    // });
    this.currGameId = parseInt(this.$route.params.id, 10);
    this.getPropList();
    this.getMallData();
  },
  methods: {
    closeBatchDialog(hadChange) {
      // tab 组件 emit 关闭 dialog
      this.batchOperate = false;
      if (hadChange) {
        // 刷新接口数据
        this.getMallData();
      }
    },
    resetTabData() {
      // 关闭 dialog 时重置 tab 组件内容
      this.$refs[this.batchTabName].resetData();
      this.batchTabName = "addGlobal";
    },
    // 自定义有效期
    showInp(row) {
      if (row.effect === 5) {
        row.isDiy = true;
      }
    },
    // 金币与房卡在同一套餐不能出现
    check() {
      // this.configData.forEach((ele) => {
      // })
    },
    // 获取道具列表
    getPropList() {
      // this.$api.getPropConfigList({
      //   game_id: this.currGameId,
      // }).then((res) => {
      //   if (Number(res.data.errno) === 0) {
      //     console.log(res)
      //     this.propList = res.data.data
      //   }
      // }).catch((err) => {
      //   throw new Error(err)
      // })
      this.propList = [
        {
          id: 57,
          prop_function: "房卡",
          prop_icon: "item_roomcard.png",
          prop_is_one_off: false,
          prop_name: "100张房卡",
          prop_src: "兑换",
          prop_support_exchange: true,
          prop_support_give: false,
          prop_support_super: true,
          prop_type: 5,
          prop_url: "",
          prop_used_result: {}
        },
        {
          id: 56,
          prop_function: "乐豆家优惠券",
          prop_icon: "",
          prop_is_one_off: false,
          prop_name: "乐豆家20无门槛券",
          prop_src: "兑换",
          prop_support_exchange: false,
          prop_support_give: false,
          prop_support_super: false,
          prop_type: 8,
          prop_url:
            "https://publicimage-1251317493.file.myqcloud.com/popIcon/201910151559081630.png",
          prop_used_result: {}
        }
      ];
    },

    // 道具名称
    getPropName(id) {
      let name = "";
      this.propList.forEach(ele => {
        if (ele.id === id) {
          name = ele.prop_name;
        }
      });
      return name;
    },
    // 消耗类型
    consumeType(row) {
      let str = "";
      Object.keys(row).forEach(el => {
        switch (el) {
          case "coin":
            // eslint-disable-next-line
            str = "金币 - " + row[el];
            break;
          case "room_card":
            // eslint-disable-next-line
            str = "房卡 - " + row[el];
            break;
          case "exchange":
            // eslint-disable-next-line
            str = "兑换券 - " + row[el];
            break;
          case "diamonds":
            // eslint-disable-next-line
            str = "钻石 - " + row[el];
            break;
          default:
            break;
        }
      });
      return str;
    },
    // 重置数据
    resetData(formName) {
      this.$refs[formName].resetFields();
      this.configData = [];
    },
    addProp() {
      this.isUpdate = false;
      this.mallSetDialog = true;
    },
    // 新增
    addPropConfig(formName) {
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          const reqData = {};
          reqData.game_id = this.currGameId;
          reqData.page_type = this.mallSetForm.page_id;
          reqData.prop_config_id = this.mallSetForm.prop_id;
          reqData.prop_price_meal = configList;
          reqData.status = this.mallSetForm.status;
          console.log(reqData);
          if (this.isUpdate) {
            reqData.id = this.mallId;
            reqData.position = this.position;
            this.$api.mallConfigUpdate(reqData).then(res => {
              if (Number(res.data.errno) === 0) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.mallSetDialog = false;
                this.getMallData();
              }
            });
          } else {
            this.$api
              .mallConfigAdd(reqData)
              .then(res => {
                if (Number(res.data.errno) === 0) {
                  this.$message({
                    type: "success",
                    message: "增加成功"
                  });
                  this.mallSetDialog = false;
                  this.getMallData();
                }
              })
              .catch(err => {
                throw new Error(err);
              });
          }
        } else {
          return false;
        }
      });
    },
    // 删除
    deletePropConfig(row) {
      // eslint-disable-next-line
      this.$confirm("确认删除？")
        .then(y => {
          this.$api
            .mallConfigDelete({
              id: row.id,
              game_id: this.currGameId
            })
            .then(res => {
              if (Number(res.data.errno) === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getMallData();
              }
            });
        })
        .catch(n => {
          console.log(n);
        });
    },
    // 获取
    getMallData() {
      // this.$api.getMallConfigList({
      //   game_id: this.currGameId,
      // }).then((res) => {
      //   if (Number(res.data.errno) === 0) {
      //     console.log(res)
      //     this.mallData = res.data.data
      //   }
      // })
      this.mallData = [
        {
          game_id: 66,
          id: 256,
          page_type: 3,
          position: 2,
          prop_config_id: 57,
          prop_price_meal: [
            {
              diamonds: 1,
              prop_buy_num: 1,
              prop_buy_day: 30
            }
          ],
          diamonds: 1,
          prop_buy_day: 30,
          prop_buy_num: 1,
          status: true
        },
        {
          game_id: 66,
          id: 255,
          page_type: 1,
          position: 1,
          prop_config_id: 56,
          prop_price_meal: [
            {
              coin: 1,
              prop_buy_num: 1,
              prop_buy_day: 30
            }
          ],
          coin: 1,
          prop_buy_day: 30,
          prop_buy_num: 1,
          status: true
        }
      ];
    },
    // 上移一位
    positionUp(row, _index) {
      if (_index === 0) {
        this.$message({
          type: "warning",
          message: "已是第一位无法修改"
        });
        return;
      }
      // row.position = this.mallData[_index - 1].position
      this.$api
        .mallPositionExchange({
          game_id: this.currGameId,
          id1: row.id,
          id2: this.mallData[_index - 1].id
        })
        .then(res => {
          if (Number(res.data.errno) === 0) {
            this.$message({
              type: "success",
              message: "修改成功！"
            });
            this.getMallData();
          }
        });
      console.log(row);
    },
    positionDown(row, _index) {
      if (_index === this.mallData.length - 1) {
        this.$message({
          type: "warning",
          message: "已是最后一位无法修改"
        });
        return;
      }
      this.$api
        .mallPositionExchange({
          game_id: this.currGameId,
          id1: row.id,
          id2: this.mallData[_index + 1].id
        })
        .then(res => {
          if (Number(res.data.errno) === 0) {
            this.$message({
              type: "success",
              message: "修改成功！"
            });
            this.getMallData();
          }
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
    // 编辑
    edit(row) {
      this.isUpdate = true;
      this.mallId = row.id;
      this.position = row.position;
      this.mallSetDialog = true;
      this.mallSetForm.status = row.status;
      this.mallSetForm.page_id = row.page_type;
      this.mallSetForm.prop_id = row.prop_config_id;
      row.prop_price_meal.forEach(ele => {
        const propObj = {};
        propObj.effectNum = ele.prop_buy_num;
        switch (ele.prop_buy_day) {
          case 0:
            propObj.effect = 0;
            propObj.isDiy = false;
            break;
          case 30:
            propObj.effect = 1;
            propObj.isDiy = false;
            break;
          case 90:
            propObj.effect = 3;
            propObj.isDiy = false;
            break;
          case 180:
            propObj.effect = 6;
            propObj.isDiy = false;
            break;
          case 360:
            propObj.effect = 12;
            propObj.isDiy = false;
            break;
          default:
            propObj.effect = ele.prop_buy_day;
            propObj.isDiy = true;
            break;
        }
        Object.keys(ele).forEach(el => {
          switch (el) {
            case "coin":
              propObj.consume = 1;
              propObj.consumeNum = ele[el];
              break;
            case "room_card":
              propObj.consume = 2;
              propObj.consumeNum = ele[el];
              break;
            case "exchange":
              propObj.consume = 3;
              propObj.consumeNum = ele[el];
              break;
            case "diamonds":
              propObj.consume = 4;
              propObj.consumeNum = ele[el];
              break;
            default:
              break;
          }
        });
        this.configData.push(propObj);
        console.log(this.configData);
      });
    },
    deleteConfig(row) {
      console.log(row.$index);
      // eslint-disable-next-line
      this.$confirm("确认删除？")
        .then(y => {
          this.configData.splice(row.$index, 1);
          // eslint-disable-next-line
        })
        .catch(n => {
          console.log(n);
        });
    }
  }
};
</script>
<style scoped>
.gold-game-change-index {
  padding: 5px 10px 5px 20px;
  cursor: pointer;
}
.gold-game-change-index i.el-icon-d-arrow-left,
i.el-icon-d-arrow-right {
  font-weight: bolder;
  color: #333;
  font-size: 20px;
}
.gold-game-change-index i.el-icon-d-arrow-left,
i.el-icon-d-arrow-right {
  transform: rotate(90deg);
}
.addBorder {
  border-bottom: 1px solid #dcdfe6;
}

addProp {
  text-align: left;
}

.el-radio + .el-radio {
  margin-left: 0;
}

i {
  color: red;
  font-size: 18px;
}

.consume {
  margin-right: 2%;
}

.tab-item {
  font-size: 20px;
}

.operate-btn {
  text-align: center;
}

.btn-confirm {
  margin-left: 60px;
}
</style>
