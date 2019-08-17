<!-- 项目信息 -->
<template>
    <div class="projectInfo">
        <div v-if="detailModel">
            <el-steps :active="parseInt(selectStadgeid)">
                <el-step v-for="(item,index) in stepDatas"
                         :description="item.description"
                         :icon="item.icon"
                         :title="item.name"
                         :key="index"
                         :style="{'cursor':item.id<=detailModel.stageId?'pointer':'normal'}"
                         @click.native="handleStageClick(item.id)">
                </el-step>
            </el-steps>
            <div v-show="pageStatus !== 'project'"
                 style="text-align: right;width: 100%;">
                <el-button size="mini"
                           @click='handleBack'>{{$l("btn_back")}}</el-button>
            </div>
            <div style="line-height:30px;padding-top:10px;">
                <el-collapse v-model="base_activeNames">
                    <el-collapse-item title="基本信息"
                                      name="1">
                        <div style="  margin-top: 10px;">
                            <!-- 项目基本信息 -->
                            <div v-if="pageStatus==='project'">
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        项目简称：{{detailModel.projectShortName}}
                                    </el-col>
                                    <el-col :span="8">
                                        项目获取时间：{{detailModel.projectGainDate | dateFormat}}
                                    </el-col>
                                    <el-col :span="5">
                                        用地性质：{{detailModel.parcelPropertyName}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        项目名称：{{detailModel.projectName}}
                                    </el-col>
                                    <el-col :span="8">
                                        项目批复名称：{{detailModel.projectOfficialName}}
                                    </el-col>
                                    <el-col :span="5">
                                        项目推广名称：{{detailModel.projectGeneralizeName}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        所属事业部：{{detailModel.companyName}}
                                    </el-col>
                                    <el-col :span="8">
                                        所属城市：{{detailModel.cityName}}
                                    </el-col>
                                    <el-col :span="5">
                                        项目负责人：{{detailModel.principleName}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        所属板块：{{detailModel.plateName}}
                                    </el-col>
                                    <el-col :span="8">
                                        城市市场类型：{{detailModel.marketType}}
                                    </el-col>
                                    <el-col :span="5">
                                        合作属性：{{detailModel.businessType}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        中梁系股权占比：{{detailModel.zlPercent}}%
                                    </el-col>
                                    <el-col :span="8">
                                        中梁地产股权占比：{{detailModel.otherPercent}}%
                                    </el-col>
                                    <el-col :span="5">
                                        是否重难点项目：{{detailModel.isDifficultProject}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="21"
                                            :offset="3">
                                        项目地址：{{detailModel.address}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="21"
                                            :offset="3">
                                        备注：{{detailModel.remark}}
                                    </el-col>
                                    <!-- <el-col :span="21"
                                        :offset="3">
                                    平面图：{{detailModel.imagePath}}
                                </el-col> -->
                                </el-row>
                            </div>

                            <!-- 分期基本信息 -->
                            <div v-if="pageStatus==='phase'">
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        <font color="red">*</font>分期名称：{{detailModel.phaseName}}
                                    </el-col>
                                    <el-col :span="8">
                                        所属项目：{{detailModel.projectName}}
                                    </el-col>
                                    <el-col :span="5">
                                        <font color="red">*</font>关联地块：{{detailModel.parcelName}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="21"
                                            :offset="3">
                                        备注：{{detailModel.remark}}
                                    </el-col>
                                </el-row>
                            </div>

                            <!-- 地块基本信息 -->
                            <div v-if="pageStatus==='parcel'">
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        <font color="red">*</font>地块名称：{{detailModel.parcelName}}
                                    </el-col>
                                    <el-col :span="8">
                                        <font color="red">*</font>地块简称：{{detailModel.parcelGeneralizeName}}
                                    </el-col>
                                    <el-col :span="5">
                                        &nbsp;
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        <font color="red">*</font>土地出让合同编号：{{detailModel.contractCode}}
                                    </el-col>
                                    <el-col :span="8">
                                        <font color="red">*</font>合同总价(万元)：{{detailModel.contractAmoun}}
                                    </el-col>
                                    <el-col :span="5">
                                        法人主体：{{detailModel.fCompanyName}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        出让方式：{{detailModel.parcelSellTyp}}
                                    </el-col>
                                    <el-col :span="8">
                                        出让人：{{detailModel.parcelSellMan}}
                                    </el-col>
                                    <el-col :span="5">
                                        用地性质：{{detailModel.parcelPropertyName}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="8"
                                            :offset="3">
                                        拿地日期：{{detailModel.parcelGainDate | dateFormat('yyyy-MM-dd')}}
                                    </el-col>
                                    <el-col :span="8">
                                        交地日期：{{detailModel.parcelTransferDate}}
                                    </el-col>
                                    <el-col :span="5">
                                        <font color="red">*</font>地块状态：{{detailModel.parcelStatus}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="21"
                                            :offset="3">
                                        地块地址：{{detailModel.address}}
                                    </el-col>
                                </el-row>
                                <el-row class="baseInfo">
                                    <el-col :span="21"
                                            :offset="3">
                                        备注：{{detailModel.remark}}
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>

                <!-- 业态信息 -->
                <el-collapse v-model="business_activeNames">
                    <el-collapse-item title="业态信息"
                                      name="1">
                        <div style="margin:10px auto;">
                            <el-table v-if="pageStatus!=='phase'"
                                      :data="detailModel.businessTypeList"
                                      align="left"
                                      size="small"
                                      stripe
                                      border
                                      tooltip-effect="dark"
                                      style="width: 100%">
                                <el-table-column label="业态">
                                    <!-- 一级业态 -->
                                    <el-table-column prop="name1"
                                                     label="一级业态"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.name1}}</template>
                                    </el-table-column>

                                    <!-- 二级业态 -->
                                    <el-table-column prop="name2"
                                                     label="二级业态"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.name2}}</template>
                                    </el-table-column>

                                    <!-- 三级业态 -->
                                    <el-table-column prop="name3"
                                                     label="三级业态"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.name3}}</template>
                                    </el-table-column>
                                </el-table-column>

                                <!-- 属性 -->
                                <el-table-column prop="properyName"
                                                 label="属性"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.properyName}}</template>
                                </el-table-column>

                                <el-table-column label="用地面积">
                                    <!-- 建筑占地面积(㎡) -->
                                    <el-table-column prop="buildingHoldArea"
                                                     label="建筑占地面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.buildingHoldArea | NumFormat}}</template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="建筑面积">
                                    <!-- 地上计容面积(㎡) -->
                                    <el-table-column prop="upCapacityArea"
                                                     label="地上计容面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.upCapacityArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地下计容面积(㎡) -->
                                    <el-table-column prop="downCapacityArea"
                                                     label="地下计容面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.downCapacityArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地上非计容面积(㎡) -->
                                    <el-table-column prop="upNonCapacityArea"
                                                     label="地上非计容面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.upNonCapacityArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地下非计容面积(㎡) -->
                                    <el-table-column prop="downNonCapacityArea"
                                                     label="地下非计容面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.downNonCapacityArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地上总建筑面积(㎡) -->
                                    <el-table-column prop="upBuildingArea"
                                                     label="地上总建筑面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.upBuildingArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地下总建筑面积(㎡) -->
                                    <el-table-column prop="downBuildingArea"
                                                     label="地下总建筑面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.downBuildingArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 避难层/设备层/架空层面积(㎡) -->
                                    <el-table-column prop="stiltFloorArea"
                                                     label="避难层/设备层/架空层面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.stiltFloorArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 塔楼地下室面积(㎡) -->
                                    <el-table-column prop="towerDownArea"
                                                     label="塔楼地下室面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.towerDownArea | NumFormat}}</template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="可售面积">
                                    <!-- 总可售面积(㎡) -->
                                    <el-table-column prop="totalSellArea"
                                                     label="总可售面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.totalSellArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地上自销可售面积(㎡) -->
                                    <el-table-column prop="upSelfSellArea"
                                                     label="地上自销可售面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.upSelfSellArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地上代建可售面积(㎡) -->
                                    <el-table-column prop="upAvailableSellArea"
                                                     label="地上代建可售面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.upAvailableSellArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地上政府有偿配建可售面积(㎡) -->
                                    <el-table-column prop="upGovernmentArea"
                                                     label="地上政府有偿配建可售面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.upGovernmentArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地上计容面积(㎡) -->
                                    <!-- <el-table-column prop="upCapacityArea"
                                                     label="地上计容面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.upCapacityArea | NumFormat}}</template>
                                    </el-table-column> -->

                                    <!-- 地下自销可售面积(㎡) -->
                                    <el-table-column prop="downSelfSellArea"
                                                     label="地下自销可售面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.downSelfSellArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地下其他可售面积(㎡) -->
                                    <el-table-column prop="downOtherSellArea"
                                                     label="地下其他可售面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.downOtherSellArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地上赠送面积(㎡) -->
                                    <el-table-column prop="upPresentArea"
                                                     label="地上赠送面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.upPresentArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 地下赠送面积(㎡) -->
                                    <el-table-column prop="downPresentArea"
                                                     label="地下赠送面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.downPresentArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 其他附加面积(㎡) -->
                                    <el-table-column prop="additionalArea"
                                                     label="其他附加面积(㎡)"
                                                     align="left">
                                        <template slot-scope="scope">{{scope.row.additionalArea | NumFormat}}</template>
                                    </el-table-column>
                                </el-table-column>

                                <!-- 可售比 -->
                                <el-table-column prop="availableThan"
                                                 label="可售比"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.availableThan}}%</template>
                                </el-table-column>

                                <!-- 住宅 -->
                                <el-table-column prop="residence"
                                                 label="住宅"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.residence}}</template>
                                </el-table-column>

                                <!--  商铺/其他 -->
                                <el-table-column prop="shops"
                                                 label="商铺/其他"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.shops}}</template>
                                </el-table-column>
                            </el-table>

                            <el-tabs type="border-card"
                                     v-if="pageStatus==='phase'">
                                <el-tab-pane v-for="stadge in detailModel.subParcelList"
                                             :key="stadge.parcelName">
                                    <span slot="label">
                                        <i class="el-icon-document
                        "></i> {{stadge.parcelName}}</span>
                                    <div>
                                        <!-- 编制表格 -->
                                        <el-table :data="stadge.businessTypeList"
                                                  align="left"
                                                  stripe
                                                  border
                                                  size="small"
                                                  tooltip-effect="dark"
                                                  style="width: 100%">
                                            <!-- 一级业态 -->
                                            <el-table-column prop="name1"
                                                             label="一级业态"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.name1}}</template>
                                            </el-table-column>

                                            <!-- 二级业态 -->
                                            <el-table-column prop="name2"
                                                             label="二级业态"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.name2}}</template>
                                            </el-table-column>

                                            <!-- 三级业态 -->
                                            <el-table-column prop="name3"
                                                             label="三级业态"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.name3}}</template>
                                            </el-table-column>

                                            <!-- 属性 -->
                                            <el-table-column prop="properyName"
                                                             label="属性"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.properyName}}</template>
                                            </el-table-column>

                                            <!-- 建筑占地面积(㎡) -->
                                            <el-table-column prop="totalBuildingArea "
                                                             label="建筑占地面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.totalBuildingArea  | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地上计容面积(㎡) -->
                                            <el-table-column prop="upCapacityArea"
                                                             label="地上计容面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.upCapacityArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地下计容面积(㎡) -->
                                            <el-table-column prop="downCapacityArea"
                                                             label="地下计容面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.downCapacityArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地上非计容面积(㎡) -->
                                            <el-table-column prop="upNonCapacityArea"
                                                             label="地上非计容面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.upNonCapacityArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地下非计容面积(㎡) -->
                                            <el-table-column prop="downNonCapacityArea"
                                                             label="地下非计容面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.downNonCapacityArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地上总建筑面积(㎡) -->
                                            <el-table-column prop="upBuildingArea"
                                                             label="地上总建筑面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.upBuildingArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地下总建筑面积(㎡) -->
                                            <el-table-column prop="downBuildingArea"
                                                             label="地下总建筑面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.downBuildingArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 避难层/设备层/架空层面积(㎡) -->
                                            <el-table-column prop="stiltFloorArea"
                                                             label="避难层/设备层/架空层面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.stiltFloorArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 塔楼地下室面积(㎡) -->
                                            <el-table-column prop="towerDownArea"
                                                             label="塔楼地下室面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.towerDownArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 总可售面积(㎡) -->
                                            <el-table-column prop="totalSellArea"
                                                             label="总可售面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.totalSellArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地上自销可售面积(㎡) -->
                                            <el-table-column prop="upSelfSellArea"
                                                             label="地上自销可售面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.upSelfSellArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地上代建可售面积(㎡) -->
                                            <el-table-column prop="upAvailableSellArea"
                                                             label="地上代建可售面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.upAvailableSellArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地上政府有偿配建可售面积(㎡) -->
                                            <el-table-column prop="upGovernmentArea"
                                                             label="地上政府有偿配建可售面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.upGovernmentArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地上计容面积(㎡) -->
                                            <!-- <el-table-column prop="upCapacityArea"
                                                             label="地上计容面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.upCapacityArea | NumFormat}}</template>
                                            </el-table-column> -->

                                            <!-- 地下自销可售面积(㎡) -->
                                            <el-table-column prop="downSelfSellArea"
                                                             label="地下自销可售面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.downSelfSellArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地下其他可售面积(㎡) -->
                                            <el-table-column prop="downOtherSellArea"
                                                             label="地下其他可售面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.downOtherSellArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地上赠送面积(㎡) -->
                                            <el-table-column prop="upPresentArea"
                                                             label="地上赠送面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.upPresentArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 地下赠送面积(㎡) -->
                                            <el-table-column prop="downPresentArea"
                                                             label="地下赠送面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.downPresentArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 其他附加面积(㎡) -->
                                            <el-table-column prop="additionalArea"
                                                             label="其他附加面积(㎡)"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.additionalArea | NumFormat}}</template>
                                            </el-table-column>

                                            <!-- 可售比 -->
                                            <el-table-column prop="availableThan"
                                                             label="可售比"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.availableThan}}%</template>
                                            </el-table-column>

                                            <!-- 住宅 -->
                                            <el-table-column prop="residence"
                                                             label="住宅"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.residence}}</template>
                                            </el-table-column>

                                            <!--  商铺/其他 -->
                                            <el-table-column prop="shops"
                                                             label="商铺/其他"
                                                             align="left">
                                                <template slot-scope="scope">{{scope.row.shops}}</template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>

                        </div>

                    </el-collapse-item>

                </el-collapse>
                <!-- 项目/地块/分期 -->
                <el-tabs type="border-card"
                         v-model="project_tabActiveName">
                    <el-tab-pane label="项目">
                        <span slot="label">
                            <i class="el-icon-date"></i> 项目</span>
                        <div>
                            <el-collapse v-model="project_activeNames">
                                <!-- 用地指标 -->
                                <el-collapse-item title="用地指标"
                                                  name="1">
                                    <div>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                总用地面积
                                                <font color='red'>(A=B+V)</font>(㎡)：{{detailModel.totalUseArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="8">
                                                建设用地面积
                                                <font color='red'>(B)</font>(㎡)：{{detailModel.buildingArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                代征用地面积
                                                <font color='red'>(V=DL+DD+QD)</font>(㎡)：{{detailModel.expropriatedArea | NumFormat}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                代征绿地面积
                                                <font color='red'>(DL)</font>(㎡)：{{detailModel.expropriatedGreenArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="8">
                                                代征地道路面积
                                                <font color='red'>(DD)</font>(㎡)：{{detailModel.expropriatedRoadArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                其他代征面积
                                                <font color='red'>(QD)</font>(㎡)：{{detailModel.expropriatedOtherArea | NumFormat}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                建筑占地面积
                                                <font color='red'>(ZS)</font>(㎡)：{{detailModel.buildingHoldArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="8">
                                                示范区面积(㎡)：{{detailModel.demonstrationArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                景观面积
                                                <font color='red'>(LD=YZ+LH+RG)</font>(㎡)：--
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                硬质景观
                                                <font color='red'>(YZ)</font>(㎡)：--
                                            </el-col>
                                            <el-col :span="8">
                                                绿地面积(㎡)
                                                <font color='red'>(LH))</font>(㎡)：{{detailModel.totalGreenArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                人工水系
                                                <font color='red'>(RG)</font>(㎡)：--
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-collapse-item>

                                <!-- 面积指标 -->
                                <el-collapse-item title="面积指标"
                                                  name="2">
                                    <div>
                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                总建筑面积
                                                <font color='red'>(G=H+L)</font>(㎡)：{{detailModel.totalBuildingArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="8">
                                                地上总建筑面积
                                                <font color='red'>(H=E+C))</font>(㎡)：{{detailModel.upBuildingArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                地下总建筑面积
                                                <font color='red'>(L=F+W)</font>(㎡)：{{detailModel.downBuildingArea | NumFormat}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                总计容面积
                                                <font color='red'>(D=E+F)</font>(㎡)：{{detailModel.totalCapacityArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="8">
                                                地上计容面积(含架空层计容)
                                                <font color='red'>(E))</font>(㎡)：{{detailModel.upCapacityArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                地下计容面积
                                                <font color='red'>(F)</font>(㎡)：{{detailModel.downcapacityArea | NumFormat}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                &nbsp;
                                            </el-col>
                                            <el-col :span="8">
                                                地上非计容面积(C)
                                                <font color='red'>(E)</font>(㎡)：{{detailModel.upNonCapacityArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                地下非计容面积
                                                <font color='red'>(W=QC+ZXC+SBF)</font>(㎡)：{{detailModel.downNonCapacityArea | NumFormat}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                纯地下汽车库建筑面积(QC)
                                                <font color='red'>(E)</font>(㎡)：{{detailModel.downGarageArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="8">
                                                地下自行车库建筑面积(ZXC)
                                                <font color='red'>(E)</font>(㎡)：--
                                            </el-col>
                                            <el-col :span="5">
                                                地下设备备用房建筑面积(SBF)(㎡)：--
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                地下其他建筑面积(QT)
                                                <font color='red'>(QT)</font>(㎡)：--
                                            </el-col>
                                            <el-col :span="8">
                                                人防建筑面积(㎡) ：--
                                            </el-col>
                                            <el-col :span="5">
                                                非计容架空层总建筑面积(㎡)：--
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                服务于车库的设备用房面积(㎡)：--
                                            </el-col>
                                            <el-col :span="8">
                                                储藏室个数 ：{{detailModel.storeRoomNum | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                储藏室面积(㎡)：{{detailModel.storeRoomArea | NumFormat}}
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-collapse-item>

                                <!-- 销售指标 -->
                                <el-collapse-item title="销售指标"
                                                  name="3">
                                    <div>
                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                总可售面积(J=M+Y)
                                                <font color='red'>(QT)</font>(㎡)：{{detailModel.totalSellArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="8">
                                                地上可售面积 ：
                                                <font color='red'>(M)</font>(㎡)：{{detailModel.upSelfSellArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                地下可售面积：
                                                <font color='red'>(Y)</font>(㎡)：{{detailModel.downSelfSellArea | NumFormat}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                总赠送面积：
                                                <font color='red'>(Q=P+Q)</font>(㎡)：{{detailModel.totalPresentArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="8">
                                                地上赠送面积：
                                                <font color='red'>(P)</font>(㎡)：{{detailModel.upPresentArea | NumFormat}}
                                            </el-col>
                                            <el-col :span="5">
                                                地下赠送面积：
                                                <font color='red'>(Q)</font>(㎡)：{{detailModel.downPresentArea | NumFormat}}
                                            </el-col>
                                        </el-row>

                                    </div>
                                </el-collapse-item>

                                <!-- 规划指标 -->
                                <el-collapse-item title="规划指标"
                                                  name="4">
                                    <div>
                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                规划建筑限高：{{detailModel.buildingMaxHeight}}
                                            </el-col>
                                            <el-col :span="8">
                                                规划建筑限低：{{detailModel.buildingMinHeight}}
                                            </el-col>
                                            <el-col :span="5">
                                                &nbsp;
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                规划容积率：{{detailModel.planRatio}}
                                            </el-col>
                                            <el-col :span="8">
                                                规划建筑密度：{{detailModel.planDensity}}
                                            </el-col>
                                            <el-col :span="5">
                                                规划绿地率：{{detailModel.planGreenRadio}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                容积率
                                                <font color='red'>(S=D/B)</font>：{{detailModel.realRatio}}
                                            </el-col>
                                            <el-col :span="8">
                                                建筑密度
                                                <font color='red'>(T=ZD/B)</font>：{{detailModel.realRensity}}
                                            </el-col>
                                            <el-col :span="5">
                                                绿地率
                                                <font color='red'>(LDL=LH/B)</font>：{{detailModel.greenRadio}}
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-collapse-item>

                                <!-- 附加指标 -->
                                <el-collapse-item title="附加指标"
                                                  name="5">
                                    <div>
                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                总车位数
                                                <font color='red'>(ZCW=SD+DX)</font>：{{detailModel.totalStallNum}}
                                            </el-col>
                                            <el-col :span="8">
                                                地上车位数
                                                <font color='red'>(DS=DM+DC+TC))</font>：{{detailModel.upStallNum}}
                                            </el-col>
                                            <el-col :span="5">
                                                地下机动车位数
                                                <font color='red'>(DX=RF+FRF+)</font>：{{detailModel.downAutoStallNum}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                地面车位数
                                                <font color='red'>(DM)</font>：{{detailModel.upGroundStallNum}}
                                            </el-col>
                                            <el-col :span="8">
                                                住宅底层车位数
                                                <font color='red'>(DC)</font>：{{detailModel.semiUndergroundStallNum}}
                                            </el-col>
                                            <el-col :span="5">
                                                停车楼车位数
                                                <font color='red'>(TCL)</font>：{{detailModel.stallNumInbuilding}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                地下人防车位树
                                                <font color='red'>(RF=RJ+RFJ)</font>：{{detailModel.downDefenceNum}}
                                            </el-col>
                                            <el-col :span="8">
                                                地下人防机械车位树
                                                <font color='red'>(RJ)</font>：{{detailModel.downDefenceMachineNum}}
                                            </el-col>
                                            <el-col :span="5">
                                                地下人防非机械车位树
                                                <font color='red'>(RFJ)</font>：{{detailModel.downDefenceNonMachineNum}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                地下非人防车位树
                                                <font color='red'>(FRF=FRJ+FRFJ)</font>：{{detailModel.downNonDefenceNum}}
                                            </el-col>
                                            <el-col :span="8">
                                                地下非人防机械车位树
                                                <font color='red'>(FRJ)</font>：{{detailModel.downNonDefenceMachineNum}}
                                            </el-col>
                                            <el-col :span="5">
                                                地下非人防非机械车位树
                                                <font color='red'>(FRFJ)</font>：{{detailModel.downNonDefenceNonMachineNum}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                半地下非人防机动车位数
                                                <font color='red'>(BDX)</font>：{{detailModel.semiDownnoDefenceMachineNum}}
                                            </el-col>
                                            <el-col :span="8">
                                                地下人防可售车位数：{{detailModel.downDefenceSellNum}}
                                            </el-col>
                                            <el-col :span="5">
                                                地下非人防可售车位数：{{detailModel.downNonDefenceSellNum}}
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                单车位面积(㎡)：{{detailModel.stallArea}}
                                            </el-col>
                                            <el-col :span="8">
                                                地下非机动车位数：{{detailModel.downNonAutoStallNum}}
                                            </el-col>
                                            <el-col :span="5">
                                                &nbsp;
                                            </el-col>
                                        </el-row>

                                        <el-row>
                                            <el-col :span="8"
                                                    :offset="3">
                                                住宅数：{{detailModel.housenum}}
                                            </el-col>
                                            <el-col :span="8">
                                                商铺/其他数：{{detailModel.shopNum}}
                                            </el-col>
                                            <el-col :span="5">
                                                可售比
                                                <font color='red'>(R=J/G)</font>：{{detailModel.availableThan}}
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>

                            <!-- 户数 -->
                            <!-- <el-table :data="detailModel.houseList"
                                  align="left"
                                  stripe
                                  border
                                  tooltip-effect="dark"
                                  style="width: 100%"> -->
                            <!-- 住宅 -->
                            <!-- <el-table-column prop="houseType1"
                                             label="住宅面积(㎡)"
                                             align="left">
                                <template slot-scope="scope">{{scope.row.houseType1}}</template>
                            </el-table-column> -->
                            <!-- 户数 -->
                            <!-- <el-table-column prop="houseTypeNum1"
                                             label="户数"
                                             align="left">
                                <template slot-scope="scope">{{scope.row.houseTypeNum1}}</template>
                            </el-table-column> -->
                            <!-- 商铺/其他 -->
                            <!-- <el-table-column prop="houseType2"
                                             label="商铺/其他"
                                             align="left">
                                <template slot-scope="scope">{{scope.row.houseType2}}</template>
                            </el-table-column> -->
                            <!-- 户数 -->
                            <!-- <el-table-column prop="houseTypeNum2"
                                             label="户数"
                                             align="left">
                                <template slot-scope="scope">{{scope.row.houseTypeNum2}}</template>
                            </el-table-column>
                        </el-table> -->
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="地块"
                                 v-if="pageStatus === 'project'">
                        <span slot="label">
                            <i class="el-icon-date"></i>地块</span>
                        <div>

                            <!-- 地块信息 -->
                            <el-table :data="detailModel.parcelList"
                                      align="left"
                                      stripe
                                      size="small"
                                      border
                                      tooltip-effect="dark"
                                      style="width: 100%">
                                <!-- 地块简称 -->
                                <el-table-column prop="parcelGeneralizeName"
                                                 label="地块简称"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.parcelGeneralizeName}}</template>
                                </el-table-column>

                                <!-- 总用地面积(㎡) -->
                                <el-table-column prop="totalUseArea"
                                                 label="总用地面积(㎡)"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.totalUseArea | NumFormat}}</template>
                                </el-table-column>

                                <!-- 建设用地面积(㎡) -->
                                <el-table-column prop="buildingArea"
                                                 label="建设用地面积(㎡)"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.buildingArea | NumFormat}}</template>
                                </el-table-column>

                                <!-- 地上总建筑面积(㎡) -->
                                <el-table-column prop="upBuildingArea"
                                                 label="地上总建筑面积(㎡)"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.upBuildingArea | NumFormat}}</template>
                                </el-table-column>

                                <!-- 地下总建筑面积(㎡) -->
                                <el-table-column prop="downBuildingArea"
                                                 label="地下总建筑面积(㎡)"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.downBuildingArea | NumFormat}}</template>
                                </el-table-column>

                                <!-- 总可售面积(㎡)-->
                                <el-table-column prop="totalSellArea"
                                                 label="总可售面积(㎡)"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.totalSellArea | NumFormat}}</template>
                                </el-table-column>

                                <!-- 查看-->
                                <el-table-column label="查看"
                                                 align="left">
                                    <template slot-scope="scope">
                                        <!-- 编辑 -->
                                        <el-button size="mini"
                                                   type="text"
                                                   icon="el-icon-view"
                                                   :title="$l('btn_detail')"
                                                   @click="handleViewParce(scope.$index, scope.row)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="分期"
                                 v-if="pageStatus === 'project'">
                        <span slot="label">
                            <i class="el-icon-date"></i>分期</span>
                        <div>

                            <!-- 地块信息 -->
                            <el-table :data="detailModel.phaseList"
                                      align="left"
                                      stripe
                                      border
                                      tooltip-effect="dark"
                                      style="width: 100%">
                                <!-- 分期名称 -->
                                <el-table-column prop="phaseName"
                                                 label="分期名称"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.phaseName}}</template>
                                </el-table-column>

                                <!-- 建设用地面积(㎡) -->
                                <el-table-column prop="buildingArea"
                                                 label="建设用地面积(㎡)"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.buildingArea | NumFormat}}</template>
                                </el-table-column>

                                <!-- 地上总建筑面积(㎡) -->
                                <el-table-column prop="upBuildingArea"
                                                 label="地上总建筑面积(㎡)"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.upBuildingArea | NumFormat}}</template>
                                </el-table-column>

                                <!-- 地下总建筑面积(㎡) -->
                                <el-table-column prop="downBuildingArea"
                                                 label="地下总建筑面积(㎡)"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.downBuildingArea | NumFormat}}</template>
                                </el-table-column>

                                <!-- 总可售面积(㎡) -->
                                <el-table-column prop="totalSellArea"
                                                 label="总可售面积(㎡)"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.totalSellArea | NumFormat}}</template>
                                </el-table-column>

                                <!-- 总户数-->
                                <el-table-column prop="houseTypeNum"
                                                 label="总户数"
                                                 align="left">
                                    <template slot-scope="scope">{{scope.row.houseTypeNum}}</template>
                                </el-table-column>

                                <!-- 查看-->
                                <el-table-column label="查看"
                                                 align="left">
                                    <template slot-scope="scope">
                                        <!-- 编辑 -->
                                        <el-button size="mini"
                                                   type="text"
                                                   icon="el-icon-view"
                                                   :title="$l('btn_detail')"
                                                   @click="handleViewPhase(scope.$index, scope.row)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                        </div>
                    </el-tab-pane>
                </el-tabs>
                <!-- 户数 -->
            </div>
        </div>
        <div v-if="!detailModel">暂无数据</div>
    </div>
</template>

<script>
import {
  getProjectInfo, // 项目信息{projectId:'',stageId:''}
  getParcelInfo, // 项目地块信息parcelVersionId
  getPhaseInfo// 项目分期信息phaseVersionId
} from '@/api/cost/accountObjectAPI'
import COSTENUM from '@/utils/cost/enum'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { NumFormat, dateFormat } from '@/filters/cost/'
export default {
  name: 'projectInfo',
  props: {
    projectId: {
      type: String,
      required: true
    },
    stageId: {
      type: String,
      default: '1'
    },
    type: {
      type: String,
      default: 'project'// project,parcel,phase
    }
  },
  filters: {
    NumFormat,
    dateFormat
  },
  data() {
    return {
      pageStatus: 'project',
      pageStageId: null,
      parcelVersionId: null,
      phaseVersionId: null,
      base_activeNames: ['1'],
      business_activeNames: ['1'],
      project_activeNames: ['1', '2', '3', '4', '5'],
      project_tabActiveName: '0',
      stepDatas: COSTENUM.stepType,
      detailModel: { stageId: 1 },
      selectStadgeid: null // 当前选中step样式
    }
  },

  components: {

  },
  mounted() {
    this.pageStatus = this.type
    // this.pageStageId = this.stageId
    this.detailModel.stageId = this.stageId

    this.getDetail()
  },
  methods: {

    handleBack() {
      this.pageStatus = 'project'
      this.getDetail()
    },
    initTableData(response) {
        // alert(!response.data)
      if (!response.data) return
      this.detailModel = response.data
      console.log("999999")
      console.log(this.detailModel)
      this.detailModel.stageId = parseInt(this.detailModel.stageId)
      this.$nextTick(function() {
        document.getElementsByTagName('app-container').top = 0
      })
    },
    getDetail(stageId) {
      LoadingUtil.showLoading()
      console.log('id')
      console.log(this.projectId)
      switch (this.pageStatus) {
        case 'project':
          // 项目
          // 转换参数
        //   debugger
          if (this.projectId) {
            getProjectInfo({ projectId: this.projectId, stageId: stageId })
              .then(response => {
                LoadingUtil.hideLoading()
                if (response && response.data && !this.pageStageId) {
                  this.selectStadgeid = response.data.stageId
                  this.pageStageId = response.data.stageId // 以项目信息阶段为准
                }
                console.log('进来了')
                this.initTableData(response)
              })
              .catch(error => {
                LoadingUtil.hideLoading()
                console.log(error)
                this.$showError(error.message ? error.message : 'msg_system_error')
              })
          }
          break

        case 'parcel':
          // 地块
          // 转换参数
          getParcelInfo({
            parcelVersionId: this.parcelVersionId,
            stageId: null // this.pageStageId
          })
            .then(response => {
              LoadingUtil.hideLoading()
              this.initTableData(response)
              
            })
            .catch(error => {
              LoadingUtil.hideLoading()
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
          break

        case 'phase':
          // 分期
          // 转换参数
        //   alert('0000')
          getPhaseInfo({
            phaseVersionId: this.phaseVersionId,
            stageId: null // this.pageStageId
          })
            .then(response => {
              LoadingUtil.hideLoading()
              this.initTableData(response)
              console.log('fenqi')
              console.log(response)
            })
            .catch(error => {
              LoadingUtil.hideLoading()
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
          break
      }
    },
    handleStageClick(selectStadgeid) {
      if (selectStadgeid && parseInt(selectStadgeid) > parseInt(this.pageStageId)) return
      this.selectStadgeid = selectStadgeid
      // this.pageStageId = selectStadgeid
      this.getDetail(selectStadgeid)
    },
    // 地块信息
    handleViewParce(index, rowData) {
      this.pageStatus = 'parcel'
      this.parcelVersionId = rowData.parcelVersionId
      this.project_tabActiveName = '0'
      this.getDetail()
    },
    // 分期信息
    handleViewPhase(index, rowData) {
      this.pageStatus = 'phase'
      this.phaseVersionId = rowData.phaseVersionId
      this.project_tabActiveName = '0'
      this.getDetail()
    }
  },
  watch: {
    'projectId': function(newValue, oldValue) {
      if (newValue !== oldValue) this.getDetail()
    }
  }
}

</script>
<style lang='scss' scoped >
.el-collapse {
  border: none;
}
.projectInfo .baseInfo {
  height: 30px;
  line-height: 30px;
}
.projectInfo .el-collapse-item__header {
  padding-left: 10px !important;
}
.projectInfo .el-col-offset-3 {
  margin-left: 1.5%;
}
</style>