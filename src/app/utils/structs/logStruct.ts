

export class LogStruct {

	public logProgrLog: number;
	public logId: string; 
	public logTsInizio: string;
	public logTsFine: string;
	public logEsito: string;
	public logUtente: string;
	public logPassword: string;
	public logCodInterfaccia: string;
	public logStato: string;
	public logTipFlusso: string;
	public logDirezione: string;
	public logLibreria: string;
	public logFile:string;
	public logMembro: string;
	public logLibSource: string;
	public logFileSource: string;
	public logMembroSource: string;
	public logFolder: string;
	public logFileName: string;
	public logFormato: string;
	public logDelimRecord: string;
	public logDelimCampo: string;
	public logCodepage: string;
	public logModAcquiszione: string;
	public logPgmControllo: string;
	public logTipologiaConn: string;
	public logHost: string;
	public logPort: number;
	public logRemoteFolder: string;
	public logRemoteFileName: string;
	public logIntegrityCheck: string;
	public logNumTentaRicez: number;
	public logIntervalloRetry: number;
	public logRetention: number;
	public logCompression: string;
	public logBackup: string;
	public logInviaMail: string;
	public logLetteraOk: string;
	public logLetteraKo: string;
	public logLogFile: string;
	public logErroreDesc: string;
	public logJobAs: string;
	public logUserAs: string;
	public logJobNbrAs: string;
	public logTipoTrasferimento: string;
	public logBypassQtemp: string;
	public logJavaHome: string;
	
	//aggiunta campi mancanti
	public logEsistenzaFile: string;
	public logLetteraFlusso: string;
	public logCreaVuoto: string;
	public logInternaz: string;
	public logSostValNull: string;
	public logElimNomCol: string;
	public logFlagOkVuoto: string;
	public logSecure: string;
	public logInteractiveType: string;
	public logInteractiveProgram: string;
	public logInteractiveResult: string;
	public logInteractiveCommand: string;
	public logDelaySemaforo: number;	
	public logHashUnico: string;
	public logExportFlag: string;
	public logExportCode: string;
	public logFetchSize: number;
	public logCharEmptySpace: string;


  constructor(data: Partial<LogStruct> = {}) { 
	this.logProgrLog = data.logProgrLog|| 0;
	this.logId = data.logId|| ""; 
	this.logTsInizio = data.logTsInizio|| "";
	this.logTsFine = data.logTsFine|| "";
	this.logEsito = data.logEsito|| "";
	this.logUtente = data.logUtente|| "";
	this.logPassword = data.logPassword|| "";
	this.logCodInterfaccia = data.logCodInterfaccia|| "";
	this.logStato = data.logStato|| "";
	this.logTipFlusso = data.logTipFlusso|| "";
	this.logDirezione = data.logDirezione|| "";
	this.logLibreria = data.logLibreria|| "";
	this.logFile = data.logFile|| "";
	this.logMembro = data.logMembro|| "";
	this.logLibSource = data.logLibSource|| "";
	this.logFileSource = data.logFileSource|| "";
	this.logMembroSource = data.logMembroSource|| "";
	this.logFolder = data.logFolder|| "";
	this.logFileName = data.logFileName|| "";
	this.logFormato = data.logFormato|| "";
	this.logDelimRecord = data.logDelimRecord|| "";
	this.logDelimCampo = data.logDelimCampo|| "";
	this.logCodepage = data.logCodepage|| "";
	this.logModAcquiszione = data.logModAcquiszione|| "";
	this.logPgmControllo = data.logPgmControllo|| "";
	this.logTipologiaConn = data.logTipologiaConn|| "";
	this.logHost = data.logHost|| "";
	this.logPort = data.logPort|| 0;
	this.logRemoteFolder = data.logRemoteFolder|| "";
	this.logRemoteFileName = data.logRemoteFileName|| "";
	this.logIntegrityCheck = data.logIntegrityCheck|| "";
	this.logNumTentaRicez = data.logNumTentaRicez|| 0;
	this.logIntervalloRetry = data.logIntervalloRetry|| 0;
	this.logRetention = data.logRetention|| 0;
	this.logCompression = data.logCompression|| "";
	this.logBackup = data.logBackup|| "";
	this.logInviaMail = data.logInviaMail|| "";
	this.logLetteraOk = data.logLetteraOk|| "";
	this.logLetteraKo = data.logLetteraKo|| "";
	this.logLogFile = data.logLogFile|| "";
	this.logErroreDesc = data.logErroreDesc|| "";
	this.logJobAs = data.logJobAs|| "";
	this.logUserAs = data.logUserAs|| "";
	this.logJobNbrAs = data.logJobNbrAs|| "";
	this.logTipoTrasferimento = data.logTipoTrasferimento|| "";
	this.logBypassQtemp = data.logBypassQtemp|| "";
	this.logJavaHome = data.logJavaHome|| "";
	
	//aggiunta campi mancanti
	this.logEsistenzaFile = data.logEsistenzaFile|| "";
	this.logLetteraFlusso = data.logLetteraFlusso|| "";
	this.logCreaVuoto = data.logCreaVuoto|| "";
	this.logInternaz = data.logInternaz|| "";
	this.logSostValNull = data.logSostValNull|| "";
	this.logElimNomCol = data.logElimNomCol|| "";
	this.logFlagOkVuoto = data.logFlagOkVuoto|| "";
	this.logSecure = data.logSecure|| "";
	this.logInteractiveType = data.logInteractiveType|| "";
	this.logInteractiveProgram = data.logInteractiveProgram|| "";
	this.logInteractiveResult = data.logInteractiveResult|| "";
	this.logInteractiveCommand = data.logInteractiveCommand|| "";
	this.logDelaySemaforo = data.logDelaySemaforo|| 0;	
	this.logHashUnico = data.logHashUnico|| "";
	this.logExportFlag = data.logExportFlag|| "";
	this.logExportCode = data.logExportCode|| "";
	this.logFetchSize = data.logFetchSize|| 0;
	this.logCharEmptySpace = data.logCharEmptySpace|| "";
  }


}