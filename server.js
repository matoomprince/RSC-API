const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {sql, poolPromise,config } = require('./db.js')

const app= express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5020;
app.listen(PORT,() => console.log(`Server is runing on ${PORT}`));






//get all SugarCaneLandSet records
app.get("/",async(req,res) =>{
    res.send('Express is working on API')
});



// app.get("/api/SugarCaneLandSet",async(req,res) =>{
//     try {
//         const pool = await poolPromise;
//         const result = await pool.query("select TOP 10 * from [RSC_DATACENTER].[dbo].[tbl_SugarCaneLandSet] WHERE SEASON_NAME = '2567' AND LandID ='67-004300-01'");
//         console.log(result);
//         res.status(200).json({
//             success:true,
//             LandData:result.recordset
//         });
//     } catch (error) {
//         console.log(`Error`,error);
//         res.status(500).json({
//             success:false,
//             message:"Server error, try again",
//             error:error.message
//         });
        
//     }
// });

app.get("/RSC/Api/:idQuota",async(req,res) =>{
    var id = req.params.idQuota;
    console.log(id);
    console.log(req.params.idQuota);

        
    try {
      
        // if (isNaN(id)){
        //     return res.status(400).json({
        //         success:false,
        //         message:"Invalid id"
        //     })
        // }
        var str_query = `SELECT  BranchID, SetID, LandID, NameLandSet, AddrLandSet, SEASON_NAME, ZoneID, QuotaID, QuotaName, LocationName, VarietiesSugarCane, TypeSugarCane, WaterSource, StatusArea, SoilArea, TotalArea, 
                          Pl_Cut, Remark, EmpCode, DateSave, IsProject, OwnerLand, RemarkLand, IDSugarCane, LandIDRef, Status_Land, Status_Harvest
        FROM [RSC_DATACENTER].[dbo].[tbl_SugarCaneLandSet] 
        WHERE  QuotaID = '${req.params.idQuota}'
        GROUP BY BranchID, SetID, LandID, NameLandSet, AddrLandSet, SEASON_NAME, ZoneID, QuotaID, QuotaName, LocationName, VarietiesSugarCane, TypeSugarCane, WaterSource, StatusArea, SoilArea, TotalArea, Pl_Cut, Remark, 
              EmpCode, DateSave, IsProject, OwnerLand, RemarkLand, IDSugarCane, LandIDRef, Status_Land, Status_Harvest
        ORDER BY LandID`;
        console.log(str_query);
        const pool = await poolPromise;
        const result = await pool
        // .input("LandID",sql.NVarChar,id)
        .query(str_query);
     
        if(result.recordset.length===0){
            return res.status(400).json({
                success:false,
                message:"ไม่พบข้อมูลแปลงปลูก !"
            })
        }
        res.status(200).json({
            success:true,
            resultData:result.recordset
        });
    } catch (error) {
        console.log(`Error`,error);
        res.status(500).json({
            success:false,
            message:"Server error, try again",
            error:error.message
        });
        
    }
});



app.get("/api/SP/SugarCaneLandSet",async(req,res) =>{
    try {
        const pool = await poolPromise;
        const result = await pool.query("select  * from [RSC_DATACENTER].[dbo].[tbl_SugarCaneLandSet] WHERE SEASON_NAME = '2568'");
        console.log(result);
        res.status(200).json({
            success:true,
            LandData:result.recordset
        });
    } catch (error) {
        console.log(`Error`,error);
        res.status(500).json({
            success:false,
            message:"Server error, try again",
            error:error.message
        });
        
    }
});


app.get("/api/SP/SugarCaneLandSetQuota/",async(req,res) =>{
 
    let body = req.body;
    let YearID = body.YearID;
    let QuotaID = body.QuotaID;  
    let BranchID = body.BranchID;
    // console.log(req.params.idQuota);
    // console.log(req.params.ddd);

console.log(YearID);
console.log(BranchID);

    try{


        var conn = new sql.ConnectionPool(config);
        conn.connect().then( async function(conn) {      
        var procedureName = "[RSC_DATACENTER].[dbo].[SP_App_Get_LandPolygonFarming]"
        const request = new sql.Request(conn);
        request.input('YearID', sql.NVarChar, YearID);
        request.input('QuotaID', sql.NVarChar, QuotaID);
        request.input('BranchID', sql.NVarChar,BranchID);
        const result = await request.execute(procedureName);
        // console.log(result);
            if(result.recordset.length===0){
                return res.status(400).json({
                    success:false,
                    message:"data not found !"
                })
            }
            res.status(200).json({
                success:true,
                data:result.recordset
            });


        });



    }catch (error) {
        console.log(`Error`,error);
        res.status(500).json({
            success:false,
            message:"Server error, try again",
            error:error.message
        });
        
    }






    
});