<template>
  <div>
    <div>
      <el-button class="addProp" type="primary" @click="addConfig">新增道具</el-button>
    </div>
    <div>
      <el-table :data="propData">
        <el-table-column prop="prop_name" align="center" label="道具名称" />
        <el-table-column prop="prop_function" align="center" label="道具功能" />
        <el-table-column prop="prop_icon" align="center" label="道具图标" />
        <el-table-column prop="prop_src" align="center" label="道具来源" />
        <el-table-column prop="prop_type" align="center" label="道具类型">
          <template slot-scope="scoped">
            <span v-if="scoped.row.prop_type === 1">头像</span>
            <span v-if="scoped.row.prop_type === 2">皮肤</span>
            <span v-if="scoped.row.prop_type === 3">表情道具</span>
            <span v-if="scoped.row.prop_type === 4">金币道具</span>
            <span v-if="scoped.row.prop_type === 5">房卡道具</span>
            <span v-if="scoped.row.prop_type === 6">实物道具</span>
            <span v-if="scoped.row.prop_type === 7">投掷魔法道具拓展包</span>
            <span v-if="scoped.row.prop_type === 8">虚拟道具</span>
          </template>
        </el-table-column>
        <el-table-column prop="prop_url" align="center" label="图片">
          <template slot-scope="scoped">
            <img v-if="scoped.row.prop_url" :src="scoped.row.prop_url" alt="图片" width="100%">
          </template>
        </el-table-column>
        <el-table-column
          prop="prop_support_exchange"
          align="center"
          label="兑换性"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.prop_support_exchange" class="green">是</span>
            <span v-else class="red">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="prop_support_give" align="center" label="赠送性">
          <template slot-scope="scoped">
            <span v-if="scoped.row.prop_support_give" class="green">是</span>
            <span v-else class="red">否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="prop_support_super"
          align="center"
          label="叠加性"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.prop_support_super" class="green">是</span>
            <span v-else class="red">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="prop_is_one_off" align="center" label="消耗性">
          <template slot-scope="scoped">
            <span v-if="scoped.row.prop_is_one_off" class="green">是</span>
            <span v-else class="red">否</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scoped">
            <el-button size="mini" @click="edit(scoped.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deletePropConfig(scoped.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <propSet ref="propSet" />
  </div>
</template>

<script>
import propSet from "./propSet"; // 道具配置
import {getpropList,propConfigDelete} from '@/api/gameModule/propsSystem';
export default {
  components: {
    propSet
  },
  data() {
    return {
      currGameId: "",
      propData: [],
      propConfigDialog: false,
      propForm: {
        name: "",
        effect: "",
        icon: "",
        propSrc: "",
        classify: "",
        prop_used_result: [{ add_prop_id: "", add_prop_num: 0 }],
        isExchange: true,
        isGive: true,
        superimposed: true,
        consumable: true,
        img_url: ""
      }
    };
  },
  created() {
    //   this.$store.commit({
    //     type: 'getCurrGameId',
    //     id: this.$route.params.id,
    //   })
    this.currGameId = parseInt(this.$route.params.id, 10);
    this.getPropListAjax();
  },
  methods: {
    addConfig() {
      this.$refs.propSet.openPropSet();
    },
    // 编辑道具
    edit(row) {
      this.$refs.propSet.openPropSet(row);
    },
    // 删除道具配置
    deletePropConfig(row) {
       this.$confirm('此操作将永久删除该道具, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.propConfigDeleteAjax(row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    propConfigDeleteAjax(id){
      propConfigDelete({game_id: 66,id:id}).then(response => {
       if (Number(response.errno) === 0) {
          this.getPropListAjax();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }
        resolve()
      }).catch(error => {
        // reject(error)
      })
    },
    // 获取道具配置列表
    getPropListAjax() {
      getpropList({game_id: 66}).then(response => {
        this.propData=response.data
        resolve()
      }).catch(error => {
        // reject(error)
      })
    }
  }
};
</script>
<style scoped>
.addProp {
  float: right;
  margin-right: 5%;
}

.adjustMargin {
  margin-bottom: 0;
}

.red {
  color: red;
}

.green {
  color: green;
}
</style>
