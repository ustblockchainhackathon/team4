/*eslint-env node*/

const erisDbFactory = require('eris-db');
const erisContracts = require('eris-contracts');
const solc = require('solc');
const accounts = require("./accounts.js").accounts;
const nodes = require("./ips.js").ips;

var erisdb; /* ErisDB Factory */
var erisdbURL; /* ErisDB RPC URL */
var pipe; /* Pipe for creating contracts */
var contractManager;/* Contract Manager for creating contracts*/
var account = accounts[0].address;

var cors = require('cors');
var userLib = require("./app/user.js");
var appLib = require("./app/lib.js");
var fs = require('fs');

var votingRecordSource = fs.readFileSync('./contracts/votingContract.sol', 'utf8');
var voters = "";
var candidates = "";
var candidatesAddress = "";
var candidatesName = "";
var erisInstance= "";

/*Initialize ERISDB*/
erisdb = erisDbFactory.createInstance(nodes[0]);
erisdb.start(function(error){
    if(!error){
        console.log("Ready to go");
    }
});

pipe = new erisContracts.pipes.DevPipe(erisdb, accounts); /* Create a new pipe*/
contractManager = erisContracts.newContractManager(pipe); /*Create a new contract object using the pipe */

/* Compile the Greeter Contract */
var compiledContract = solc.compile(votingRecordSource);
console.log("Compiled Contract:" + compiledContract.contracts.VotingRecord);
var contractFactory = contractManager.newContractFactory(JSON.parse(compiledContract.contracts.VotingRecord.interface)); //parameter is abi
console.log("Contract Factory:" + contractFactory);

/* Send the contract */
    contractFactory.new.apply(contractFactory, 
    [  // Votantes
      ["2C80E51D840E0B3F16A0DD8A229C80920566FC98", "511991B86D4CB031FE460F0FFC269B8F5C3FE499", "EB14AA581BB4F6227D7540711DA04C21807C7F6B", "A7EEEC804A4D5F6CD299B1F8FBE8C4A443ADFC04", "6523D068E57975BE8551B54C6E7A1E3B79791066", "D744227AE01D4F8F7ADF7D6B1D28AD81F69CFC35", "340872446F6BEF795A568F9A64D6DE70548C3853", "7D618EB254AD609814CC231F4EF65438EF666926", "3D41F8CA67F89D26263E9C3282A026622D0F192A", "7DB711C437463CF0A4C2A192D76DCAB8FF212CEE", "40859E78CB0A3EF1FB2E8D2D50F5F516F54BD1E0", "770145D08A5C44491A21C84221678AA6BEF27D2B", "44F84AE4957EAEF9F23CE81A7DCFD7CF924E7AE4", "5F58DC43C35C62C82FBC5C564313F1509904FFA4", "351E72139B490FD9E95EBBFB4FF7418479DC33B6", "5E48C4182949D29732014A18E9539C447D930AD0", "FD82741D1759941B5F7875DBDD82CCA390FB4F82", "1E37EC8A4CE00DE15A280EB0F50EE2872B9C43FA", "08C0A76632B568AA3AFCD803668881017AF648A0", "74E473BF799DC27FB21624E4EEE290A2B0229B22", "DF485C519675D37A007AC590A03EFD4B61EC474C", "688E65F9360942F62DFA4D103417E1A78967928D", "9931FB46B05475A23A1DF989946A49527F98D74A", "EF61778AC2FC56F4CBCC3C82605CCD77D37595F6", "546983940AB08F6F15E647049CB52374B802FE23", "D9D7626368AFDE9F4422B14EC0E50EFE46AF29F5", "E99F45A6AE3797A77CC244B0ED060492C0E78020", "78D4D8983D6722FB5C066DA0961AD509120FAF1F", "32F8ED7D996E055C6497447AC1C2ECE1AFE114C3", "FD8EDD1662292AA87BBF5F512D652F5D2255B665"],
      // Votados
      ["2EC5E0443ABE8D8B4FC811457BBE81BD18FDF6A2", "F0B3B4724C1DAA973D49051A6C1856343C804998", "DAE18A9C7D286C10D6A2FD7CE2AC5D0FA54BCCD2", "F8F9DD0D144CA0ABC465E83A9068EE4CD43C292D", "A99287FE0DAC4E8145C857EA65E9EDE1560A2DB2", "BF8F3AA4591BB4EC5AE8B51F706226A54ACB65FB", "5EB74A33282F8EDAD47FEA80A1DB5AE33330CEC2", "B8BC8A39600B74610A2674D4B6DB097B407C5A34", "8C53DF4D478480F3CD289BAC2416B98102B78FB3", "91706241CA883AED9D1AD8FEB772BC275EB85A0F"], 
      // Nombres votados
      [appLib.convertToHex("Team 000"), appLib.convertToHex("Team 001"),appLib.convertToHex("Team 002"),appLib.convertToHex("Team 003"),appLib.convertToHex("Team 004"),appLib.convertToHex("Team 005"),appLib.convertToHex("Team 006"),appLib.convertToHex("Team 007"),appLib.convertToHex("Team 008"),appLib.convertToHex("Team 009")], 
      // Nombre votación
      "Votación UST Hackathon", 
      { from: account, 
        data:compiledContract.contracts.VotingRecord.bytecode}, 
        (err, contractInstance)=> {
          if(err){
            console.log(err)
          }else{
            erisInstance = contractInstance;
            console.log(contractInstance.address);
          }
      }
    ]);


// Load the appropriate modules for the app
var cfenv = require("cfenv");
var express = require("express");
var bodyParser = require('body-parser');

// Defensiveness against errors parsing request bodies...
process.on('uncaughtException', function (err) {
    console.log('#### Caught exception: ' + err);
});
process.on("exit", function(code) {
    console.log("#### Exiting with code: " + code);
});

// Checking Bluemix setup
var appEnv = cfenv.getAppEnv();

// Configure the app web container
var app = express();
app.use(cors());
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

// Finishing configuration of the app web container
app.listen(appEnv.port);
console.log("#### Server listening on port " + appEnv.port);

// Home page
app.get('/', function (req, res) 
{
      res.render('index.html', {compiledContract: compiledContract});   
});

app.get('/getCandidates', function (req, res) 
{
      userLib.getCandidates(req,res,erisInstance);   
});

app.post('/vote', function (req, res) 
{
      userLib.vote(req,res);   
});
