<template>
	<div>
		<el-table :data="formatData" :row-style="showRow" v-bind="$attrs">
			 <el-table-column  v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width">
			      <template slot-scope="scope">
				        <span v-if="index === 0" v-for="space in scope.row._level" class="space" :key="space"></span>
				        <span class="tree-ctrl" :style="{visibility:iconShow(index,scope.row)}" v-if="index === 0" @click="toggleExpanded(scope.row)">
				          <i v-if="!scope.row._expanded" class="el-icon-caret-right"></i>
				          <i v-else class="el-icon-caret-bottom"></i>
				        </span>
			        {{scope.row[column.value]}}
			      </template>
		    </el-table-column>
		    <slot></slot>
		</el-table>
	</div>
</template>

<script>
  export default{
  	name:'treeTable',
  	props:{
  		columns:{
  			type:Array,
      		default:()=>[]
  		},
  		data:{
  			type:Array,
      		default:()=>[]
  		}
  	},
  	computed:{
  		formatData(){
  			return this.treeToArray(this.data,false)
  		}
  	},
  	mounted(){
  	},
  	methods:{
  		iconShow(index, record) {
  			if(index === 0 && record.children && record.children.length > 0){
  				return "visible"
  			}else{
  				return "hidden"
  			}
    	},
    	//表格行是否显示
  		showRow(row){
  			const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
		    row.row._show = show
		    return show ? 'animation:treeTableShow .5s ease-in-out;-webkit-animation:treeTableShow .5s ease-in-out;' : 'display:none;'
  		},
  		//切换状态
  		toggleExpanded(row){
    		row._expanded=!row._expanded;
  		},
  		//转换数据
  	    treeToArray(data, expandAll, parent = null, level = null) {
		  let tmp = []
		  const _this=this;
		  Array.from(data).forEach(function(record) {
		    if (record._expanded === undefined) {
		      _this.$set(record, '_expanded', expandAll)
		    }
		    let _level = 1
		    if (level !== undefined && level !== null) {
		      _level = level + 1
		    }
		    _this.$set(record, '_level', _level)
		    // 如果有父元素
		    if (parent) {
		      _this.$set(record, 'parent', parent)
		    }
		    tmp.push(record)
		    if (record.children && record.children.length > 0) {
		      const children =_this.treeToArray(record.children, expandAll, record, _level)
		      tmp = tmp.concat(children)
		    }
		  })
		  return tmp
		}

  	}

  }
  
</script>
<style>
	@keyframes treeTableShow {
	    from {opacity: 0;}
	    to {opacity: 1;}
	}
	@-webkit-keyframes treeTableShow {
	    from {opacity: 0;}
	    to {opacity: 1;}
	}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
	$marginLeft:14px;
	.space{
		display: inline-block;
		width: $marginLeft;
		height: 16px;
		vertical-align:middle;
	}
	.tree-ctrl{
		user-select:none;
	}
	
</style>