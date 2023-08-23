import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { DynamicDialogComponent } from '../../utils/DynamicDialogComponent';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Node } from "./node"
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { Solicitante, IUSolicitanteResponse } from "../../model/solicitante.model";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
interface Option {
  option: string;
  question: string;
  context: string;
  controllers: any;
  calcs: any;
  options: Option[];
}

interface municipiosModel {
  CORP_CIDADE: any[]; // You can replace 'any' with a more specific type if you have one
}

export class formCalcObj {
  //Lançamentos
  fcIndex = '';
  fcTipoCalculo = "";
  fcIndiceLanca = "";
  fcIndiceLancaTexto = "";
  fcListaLancamento = '';
  fcDtIniLanca = '';
  fcDtFimLanca = '';
  fcValorLanca = 0;
  fcDescricao = "";
  fcDescricaoOutros = '';
  //Juros
  fcJuros = '';
  fcDtIniJuros = '';
  fcDtFimJuros = '';
  fcValorJuros = '';
  fcIndiceJuros = "";
  fcTaxaJuros = 0;
  //Abatimentos
  fcAbatimentos = "";
  fcDtAbatimento = "";
  fcValorAbatimento = "";
  //multa
  fcValorMulta = 0;
  fcMultaDias = 0;
}
export class datesObj {
  //Lançamentos
  fcDtIniLanca = '';
  fcDtFimLanca = moment().toDate();
  datasLancaIsValid = false;
  nDias = 0;
  errorDate = '';
  //Juros
  fcDtIniJuros = '';
  datasJurosIsValid = false;
  fcDtFimJuros = '';
  errorDateJuros = '';
}
@Component({
  selector: 'app-sat-form',
  templateUrl: './sat-form.component.html',
  styleUrls: ['./sat-form.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }), // Start transparent and below 20px
        animate('200ms', style({ opacity: 1, transform: 'translateY(0)' })) // Fade to full opacity and move to original position
      ])
    ]),
    trigger('detalhes', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-200px)' }), // Start transparent and outside the viewport
        animate('200ms', style({ opacity: 1, transform: 'translateX(0)' })) // Fade to full opacity and move to original position
      ])
    ]),
    trigger('fadeOut', [
      state('void', style({ opacity: 1 })),
      transition('* => void', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ])
  ],

})
export class SatFormComponent implements OnInit {


  stepToLoad: any = 'solicitante'
  stepsLoaded: any = []
  spinner: boolean = false
  usuarioSCA: any = null
  solicitanteMat: any = null

  preForm: any = null;


  membrosAtivos: any = []

  procedimentosUsuSolicit: any = [];

  municipiosArr: any[] = []; // Replace with your actual municipios data
  filteredMunicipios: any = [];
  searchMunicipio: any;
  municipio: any;

  temas: any = []
  filteredTemas: any = [];
  searchTema = ''

  json: any;

  currentOptions: Option[] | null = null;
  selectedPath: string[] = [];
  isRoot: boolean = true;
  steps: Option[] = [];
  currentQuestion: string = '';
  showTemplate: boolean = false
  currentOption: any = {}
  inTransition: boolean = false
  calculating: boolean = false
  calcDone: boolean = false
  public node: Node | any;
  previousNodes: any = []
  options: string[] = [];
  skipEnabled: boolean = false;
  data: any;
  parents: any;
  public formCalcObj
  public datesObj
  activeChip: any = null


  // hard code to some form option

  listaProcedimentosFake = [
    {
      mprj: '202100711238',
      origem: 'MGP',
      origemTipo: 'M',
      info1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      info2: 'Lorem ipsum dolor sit amet.',
      info3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      mprj: '20216871543',
      origem: 'MGP',
      origemTipo: 'M',
      info1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      info2: 'Lorem ipsum dolor sit amet.',
      info3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      mprj: '202100768299',
      origem: 'Policial',
      origemTipo: 'P',
      info1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      info2: 'Lorem ipsum dolor sit amet.',
      info3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      mprj: '202100355500',
      origem: 'Policial',
      origemTipo: 'P',
      info1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      info2: 'Lorem ipsum dolor sit amet.',
      info3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      mprj: '202100768211',
      origem: 'Policial',
      origemTipo: 'P',
      info1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      info2: 'Lorem ipsum dolor sit amet.',
      info3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      mprj: '202100345233',
      origem: 'Integra Extra-judicial',
      origemTipo: 'E',
      info1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      info2: 'Lorem ipsum dolor sit amet.',
      info3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      mprj: '202100734566',
      origem: 'Integra Judicial',
      origemTipo: 'J',
      info1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      info2: 'Lorem ipsum dolor sit amet.',
      info3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      mprj: '202168711276',
      origem: 'Integra Judicial',
      origemTipo: 'J',
      info1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      info2: 'Lorem ipsum dolor sit amet.',
      info3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    }
  ]

  usuarioLogadoFake = {
    name: "Charles Patrick Kaufmann Robbs",
    matricula: "00006544"
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService,
    public dialog: MatDialog,

    private apiService: ApiService
  ) {
    this.formCalcObj = new formCalcObj()
    this.datesObj = new datesObj()


  }

  ngOnInit(): void {
    this.showTemplate = true;
    this.resetPreForm('all')
    this.getUser()
    this.getMunicipios()
    this.changeStep('solicitante')
    this.authService.isAutenticate.subscribe((isAuth: any) => {
      console.log('isAuth', isAuth);
      if (isAuth === false) {
        // this.router.navigate(['login']);
      }
    });

  }


  getUser() {
    const loggedUser = JSON.stringify(this.usuarioLogadoFake); // TESTES - APAGAR
    localStorage.setItem('loggedUser', loggedUser);           // TESTES - APAGAR
    const usrString = localStorage.getItem('loggedUser');
    if (usrString) {
      setTimeout(() => {
        const usr = JSON.parse(usrString);
        this.usuarioSCA = usr;
        this.stepToLoad = 'solicitante'
        this.stepsLoaded.push('solicitante')
      }, 200);
    } else {
      this.authService.isAutenticate.next(false);
      this.router.navigate(['login']);
    }
    console.log('stepToLoad', this.stepToLoad);
  }






  // NAVIGATION THROUGH STEPS *******************************

  changeStep(step: string) {
    this.stepToLoad = step
    this.stepsLoaded.push(step)
    console.log('stepToLoad', this.stepToLoad)
    console.log("this.preForm", this.preForm)

    if (step === "solicitante") {
      this.http.get<any>('../../assets/data/MembrosAtivos.json').subscribe((json) => {
        this.membrosAtivos = json.data
      });
    }
    if (step === "procedimento") {
      this.http.get<any>('../../assets/data/ProcedimentosUsuSolicit.json').subscribe((json) => {
        this.procedimentosUsuSolicit = json.data
      });
    }
    if (step === "tema") {
      this.getTemas()
    }
  }

  openDynamicDialog(data: any) {
    const dialogRef = this.dialog.open(DynamicDialogComponent, {
      width: '400px',
      data
    });
  }



  // PREFORM SETTINGS *****************************************

  resetPreForm(block: string) {
    if (block === 'all') {
      this.preForm = {
        solicitanteObj: null,
        procedimentoObj: null,
        municipioObj: null,
        complementacaoObj: { isComplementacao: null, nITAnterior: null },
        temasArr: null,
        servicosArr: null,
        duvidaSuspeitaObj: null,
        atendPrioritarioObj: null,
        duvidaTecnicaObj: null
      }
    } else {
      this.preForm[block] = null
    }
    console.log("this.preForm", this.preForm)
  }

  setPreForm(block: string, content: any, nextStep: string) {
    this.preForm[block] = content
    this.changeStep(nextStep)
    console.log("this.preForm", this.preForm)
  }

  // FILTROS E BUSCAS EM TABELAS  ***************************************

  getMembroByMatricula(matricula: string) {
    if (!matricula) {
      // If the matricula is empty, reset the filtered array
      this.preForm.solicitanteObj = null;
      return;
    }
    matricula = '0000000' + matricula
    matricula = matricula.substring(matricula.length - 8);
    this.spinner = true
    let membro = this.membrosAtivos.filter((membro: any) => membro.MATRICULA === matricula)[0];
    if (membro !== undefined && membro !== null) {
      this.preForm.solicitanteObj = {
        nome: membro.NOME,
        matricula: membro.MATRICULA
      }
    } else {
      let data = {
        title: 'Membro não encontrado',
        content: 'Não foi possível encontrar o Membro com o número de matrícula: ' + matricula,
        subcontent: ' Feche esta caixa, confira o número da matrícula e tente novamente.'
      }
      this.openDynamicDialog(data)
    }
    this.spinner = false
  }

  getMunicipios() {
    this.http.get<municipiosModel>('../../assets/data/municipios.json').subscribe((json) => {
      this.municipiosArr = json.CORP_CIDADE
      console.log(this.municipiosArr)
      this.filteredMunicipios = this.municipiosArr
    });
  }

  filterCities(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredMunicipios = this.municipiosArr.filter(city => city.CIDA_NM_CIDADE.toLowerCase().includes(filterValue));
    console.log(this.filteredMunicipios)
  }

  getTemas() {
    this.http.get<any>('../../assets/data/tema.json').subscribe((json) => {
      this.temas = json.data
      console.log(this.temas)
      this.filteredTemas = this.temas
    });
  }
  filterTemas(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredTemas = this.temas.filter((tema: any) => tema.TMAN_NM_TEMA.toLowerCase().includes(filterValue));
    console.log(this.filteredTemas)
  }
  addTema(tema: any) {
    this.preForm
  }

  // navigation on json *************************************

  getJson(jsonFile: any) {
    this.http.get('../../assets/decision-tree/' + jsonFile).subscribe((json) => {
      this.json = json;

      this.currentOptions = this.json.options;
      this.currentQuestion = this.json.question; // Update current question
      this.isRoot = true
      this.reset();
    });
  }

  selectOption(option: Option) {
    this.inTransition = true
    this.selectedPath.push(option.option);

    const regex = /\b(com|sem|não|sim)\b/gi;
    option.context = option.context.replace(regex, '<strong>$1</strong>');


    this.steps.push(option);

    this.currentOptions = option.options;
    this.currentQuestion = option.question; // Update current question
    this.isRoot = false;
    this.currentOption = this.steps[this.steps.length - 1]
    console.log(this.currentOption)
    setTimeout(() => {
      this.inTransition = false
      if (this.currentOption.controllers.setCalcValues === true) {
        console.log("selectOption", option)
      }
    }, 500);
  }

  navigateBack() {
    if (this.selectedPath.length > 0) {
      this.selectedPath.pop();
      this.steps.pop();
      this.updateCurrentOptions();
      if (this.steps.length > 0) {
        this.currentQuestion = this.steps[this.steps.length - 1].question;
        this.currentOption = this.steps[this.steps.length - 1]
      } else {
        this.isRoot = true
        this.currentQuestion = this.json.question; // Set currentQuestion to root question
        this.currentOption = this.json
      }

    }

  }

  navigateToRoot() {
    this.isRoot = true
    this.selectedPath = [];
    this.updateCurrentOptions();
    this.currentOption = this.json
    this.steps = [];
    this.currentQuestion = this.json.question; // Update current question to root question
  }

  newCalc() {
    window.location.reload();
  }

  goToStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      this.steps.splice(index + 1);
      this.selectedPath = this.steps.map((step) => step.option);
      this.updateCurrentOptions();
      this.currentOption = this.steps[this.steps.length - 1]
      this.currentQuestion = this.steps[this.steps.length - 1]?.question; // Update current question
    }
  }

  private updateCurrentOptions() {
    let currentOptions = this.json.options;
    for (const key of this.selectedPath) {
      const option = currentOptions.find((o: Option) => o.option === key);
      if (option) {
        currentOptions = option.options;
      } else {
        currentOptions = [];
        break;
      }
    }
    this.currentOptions = currentOptions.length > 0 ? currentOptions : null;
  }

  reset() {
    this.isRoot = true
    this.node = this.data;
    this.formCalcObj = new formCalcObj()
    this.datesObj = new datesObj()
    this.parents = []
  }

  goHome() {
    window.location.href = '/sat';
  }


  logOut() {
    this.authService.logOut()
      .subscribe((resp) => {
        console.log(resp)

      });

  }

}
