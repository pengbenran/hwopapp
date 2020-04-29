<template>
  <div>
    <el-dialog
      title="道具配置"
      width="500px"
      :visible.sync="propConfigDialog"
      @close="resetData('propForm')"
    >
      <el-form
        ref="propForm"
        :model="propForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="道具名称" prop="name">
          <el-input
            v-model="propForm.name"
            auto-complete="off"
            placeholder="请输入道具名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="道具功能" prop="effect">
          <el-input
            v-model="propForm.effect"
            auto-complete="off"
            placeholder="请输入道具功能"
          ></el-input>
        </el-form-item>
        <el-form-item label="icon获取">
          <el-radio v-model="radio" label="1" @change="setVal">输入icon</el-radio>
          <el-radio v-model="radio" label="2" @change="setVal">上传图片</el-radio>
        </el-form-item>
        <el-form-item v-if="radio === '1'" label="道具图标" prop="icon">
          <el-input
            v-model="propForm.icon"
            auto-complete="off"
            placeholder="请输入道具图标"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="radio === '2'" label="图片上传">
          <input
            id="imgLocal"
            ref="imgLocal"
            name="imgLocal"
            type="file"
            accept="image/*"
            @change="upimage"
          >
        </el-form-item>
        <el-form-item label="道具来源" prop="propSrc">
          <el-input
            v-model="propForm.propSrc"
            auto-complete="off"
            placeholder="请输入道具来源描述，如好友赠送、金币等"
          ></el-input>
        </el-form-item>
        <el-form-item label="道具类型" prop="classify">
          <el-select
            v-model="propForm.classify"
            placeholder="请选择道具类型"
            @change="resetPropused"
          >
            <el-option
              v-for="item in propClassify"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="propForm.classify === 7" label="道具包内含道具">
          <el-button
            type="primary"
            size="mini"
            @click="addProp"
          >新增</el-button>
          <div
            v-for="prop in propForm.prop_used_result"
            :key="prop.add_prop_id"
            style="margin-top: 20px;"
          >
            <el-select
              v-model="prop.add_prop_id"
              style="width: 130px;margin-right: 10px;"
              placeholder="请选择道具"
            >
              <el-option
                v-for="item in propData"
                :key="item.id"
                :label="item.prop_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-input-number v-model="prop.add_prop_num" :min="1">
            </el-input-number>
          </div>
        </el-form-item>
        <el-form-item class="adjustMargin" label="兑换性">
          <el-radio
            v-model="propForm.isExchange"
            :label="true"
            size="mini"
            border
          >是</el-radio>
          <el-radio
            v-model="propForm.isExchange"
            :label="false"
            size="mini"
            border
          >否</el-radio>
        </el-form-item>
        <el-form-item class="adjustMargin" label="赠送性">
          <el-radio
            v-model="propForm.isGive"
            :label="true"
            size="mini"
            border
          >是</el-radio>
          <el-radio
            v-model="propForm.isGive"
            :label="false"
            size="mini"
            border
          >否</el-radio>
        </el-form-item>
        <el-form-item class="adjustMargin" label="叠加性">
          <el-radio
            v-model="propForm.superimposed"
            :label="true"
            size="mini"
            border
          >是</el-radio>
          <el-radio
            v-model="propForm.superimposed"
            :label="false"
            size="mini"
            border
          >否</el-radio>
        </el-form-item>
        <el-form-item class="adjustMargin" label="消耗性">
          <el-radio
            v-model="propForm.consumable"
            :label="true"
            size="mini"
            border
          >是</el-radio>
          <el-radio
            v-model="propForm.consumable"
            :label="false"
            size="mini"
            border
          >否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="propConfigDialog = false">取 消</el-button>
        <el-button type="primary" @click="addPropConfig('propForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {updataImgAPI,propConfigUpdate,propConfigAdd} from '@/api/gameModule/propsSystem';
export default {
  components: {},
  data() {
    return {
      propForm: {},
      propConfigDialog: false,
      radio: "1",
      isUpdate: 0,
      id: "",
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        effect: [
          { required: true, message: "请输入道具功能", trigger: "blur" }
        ],
        icon: [{ required: true, message: "请输入道具图标", trigger: "blur" }],
        propSrc: [
          { required: true, message: "请输入道具来源描述", trigger: "blur" }
        ],
        classify: [
          { required: true, message: "请选择道具类型", trigger: "change" }
        ]
      },
      propClassify: [
        { value: 1, label: "头像" },
        { value: 2, label: "皮肤" },
        { value: 3, label: "表情道具" },
        { value: 4, label: "金币道具" },
        { value: 5, label: "房卡道具" },
        { value: 6, label: "实物道具" },
        { value: 7, label: "投掷魔法道具拓展包" },
        { value: 8, label: "虚拟道具" }
      ]
    };
  },
  methods: {
    openPropSet(editFrom) {
      this.propConfigDialog = true;
      if (editFrom) {
        if (editFrom.prop_url) {
          this.radio = "2";
        } else {
          this.radio = "1";
        }
        this.isUpdate = 1;
        this.id = editFrom.id;
        this.propForm.name = editFrom.prop_name;
        this.propForm.effect = editFrom.prop_function;
        this.propForm.icon = editFrom.prop_icon;
        this.propForm.propSrc = editFrom.prop_src;
        this.propForm.classify = editFrom.prop_type;
        this.propForm.img_url = editFrom.prop_url;
        this.propForm.isExchange = editFrom.prop_support_exchange;
        this.propForm.isGive = editFrom.prop_support_give;
        this.propForm.superimposed = editFrom.prop_support_super;
        this.propForm.consumable = editFrom.prop_is_one_off;
        if (editFrom.prop_type === 7) {
          this.propForm.prop_used_result = editFrom.prop_used_result;
        }
      } else {
        this.isUpdate = 0;
      }
    },
    // 清空数据
    resetData(formName) {
      this.$refs[formName].resetFields();
    },
    // 单选一项，清楚另外一项
    setVal() {
      if (this.radio === "1") {
        this.propForm.img_url = "";
      } else {
        this.propForm.icon = "";
      }
    },
    resetPropused() {
      this.propForm.prop_used_result = [{ add_prop_id: "", add_prop_num: 0 }];
    },
    addProp() {
      this.propForm.prop_used_result.push({ add_prop_id: "", add_prop_num: 0 });
    },
    // 上传图片到腾讯云
    upimage() {
      const ImgFormData = new FormData();
      ImgFormData.append("file", this.$refs.imgLocal.files[0]);
      ImgFormData.append("dir_name", "popIcon");
      ImgFormData.append("bucket_name", "publicimage");
      ImgFormData.append("region", "ap-shanghai");
      //  图片 上传图片至腾讯云中
      updataImgAPI(ImgFormData)
        .then(res => {
          if (parseInt(res.errno) === 0) {
            this.$message({
              type: "success",
              message: "上传图片成功！",
              duration: 3200
            });
            this.propForm.img_url = res.fileurl;
          } else {
            this.$message({
              type: "error",
              message: `上传图片失败!请检查上传的图片地址是否为空。${
                res.data.errmsg
              }`,
              duration: 3200
            });
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: `上传图片失败!请重试。${error}`,
            duration: 3200
          });
        });
    },
    // 编辑道具
    propConfigUpdateAjax(reqData){
      propConfigUpdate(reqData).then(res => {
          if (Number(res.errno) === 0) {
            this.propConfigDialog = false;
            this.$message({
              type: "success",
              message: "更新道具配置成功！"
            });
            this.getPropList();
          }
        })
        .catch(err => {
          throw new Error(err);
        });
    },
    // 新增道具
    propConfigAddAjax(reqData){
      propConfigAdd(reqData).then(res => {
        if (Number(res.errno) === 0) {
          this.propConfigDialog = false;
          this.$message({
            type: "success",
            message: "添加道具配置成功！"
          });
          this.getPropList();
        }
      })
      .catch(err => {
        throw new Error(err);
      });
    },
    addPropConfig(formName) {
      if (this.radio === "2") {
        if (this.propForm.img_url === "") {
          this.$message({
            type: "warning",
            message: "请先上传图片！"
          });
          return;
        }
      }
      // eslint-disable-next-line
      this.$refs[formName].validate(valid => {
        if (valid) {
          const reqData = {};
          reqData.game_id = this.currGameId;
          reqData.prop_name = this.propForm.name;
          reqData.prop_function = this.propForm.effect;
          reqData.prop_type = this.propForm.classify;
          reqData.prop_icon = this.propForm.icon;
          reqData.prop_src = this.propForm.propSrc;
          reqData.prop_url = this.propForm.img_url;
          reqData.prop_support_exchange = this.propForm.isExchange;
          reqData.prop_support_give = this.propForm.isGive;
          reqData.prop_support_super = this.propForm.superimposed;
          reqData.prop_is_one_off = this.propForm.consumable;
          console.log(reqData);
          if (this.propForm.classify === 7) {
            reqData.prop_used_result = this.propForm.prop_used_result;
          }
          if (this.isUpdate === 1) {
            reqData.id = this.id;
            this.propConfigUpdateAjax(reqData)
          } else {
            this.propConfigAddAjax(reqData)
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
