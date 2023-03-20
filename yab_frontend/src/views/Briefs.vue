<script>
export default{
    data() {
        return {
            briefs: null, 
            new_brief_title: '',
            new_brief_url: '',
            new_brief_nb_apprs: '',
            cur_brief_title: '',
            cur_brief_url: '',
            cur_brief_nb_apprs: '', 
            cur_groups: [],
            messages: [],
            msg_class: "sucess_msg",
            add_brief: false,
            voir_groups: false,

        }
    },
    methods: {
        clearMessages(){
            this.messages = []
        },
        resetGroups() {
            this.cur_groups = []
        },
        async fetchBriefs() {
            console.log("Fetching briefs")
            const res = await fetch(
                `http://127.0.0.1:8000/api/briefs/`
            )
            this.briefs = await res.json()
            
        },        
        async addBrief() {
            fetch("http://127.0.0.1:8000/api/briefs/", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    "brief_title": this.new_brief_title,
                    "brief_url": this.new_brief_url,
                    "brief_nb_apprs": this.new_brief_nb_apprs
                })
            })
            .then( (response) => {
                this.clearMessages()
                if ((response.status > 200 && response.status < 300) || response.status == 400) {
                    return new Promise((resolve) => response.json()
                    .then((result) => resolve({
                    status: response.status,
                    result,
                    })));
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(({status, result}) => {
                console.log("Result: ", result)
                console.log("Status: ", status)
                if (status == 400){
                    for (const [key, value] of Object.entries(result)) {
                        this.messages.push(`Erreur pour le champ ${key} : ${value}`)
                    }
                    this.msg_class = "err_msg"
                } else {
                    this.messages.push(`Brief ${result.brief_title} ajouté avec succès!`)
                    this.msg_class = "succes_msg"
                    this.fetchBriefs()
                }
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
        },
        async updateBrief(brief_id) {
            fetch(`http://127.0.0.1:8000/api/briefs/${brief_id}/`,{
                method: "PATCH",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "brief_title": this.cur_brief_title,
                    "brief_url": this.cur_brief_url,
                    "brief_nb_apprs": this.cur_brief_nb_apprs,
                })
            })
            .then( (response) => {
                this.clearMessages()
                if ((response.status == 200 && response.status > 300) || response.status ==400) {
                    return new Promise((resolve) => response.json()
                    .then((result) => resolve({
                        status: response.status,
                        result,
                    })));
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(({status, result}) => {
                console.log("Result: ", result)
                console.log("Status: ", status)
                if (status == 400){
                    for (const [key, value] of Object.entries(result)) {
                        this.messages.push(`Erreur pour la champ ${key}: ${value}`)
                    }
                    this.msg_class = "err_msg"
                } else {
                    this.messages.push(`Brief ${result.brief_title} mis à jour avec succès !`)
                    this.msg_class = "succes_msg"
                    this.hide_all()
                    this.fetchBriefs()
                }
            })
            .catch((error) => {
                console.error('Error', error);  
            })
        },
        async deleteBrief(brief_id, brief_title) {
            if(confirm(`Voulez-vous vraiement supprimer ${brief_title} ?`)){
                fetch(`http://127.0.0.1:8000/api/briefs/${brief_id}`, {
                    method: "DELETE",
                })
                .then( (response) => {
                    this.clearMessages()
                    if (response.status == 204) {
                        this.messages.push(`Brief supprimé avec succès!`)
                        this.msg_class = "succes_msg"
                        this.hide_all()
                        this.fetchBriefs()
                    } else {
                        throw Error(response.statusText)
                    }
                })
                .catch((error) => {
                    console.error('Error :', error);
                })
            }
        },
        async createGroups(brief_id) {
                fetch(`http://127.0.0.1:8000/api/briefs/gen_groups/${brief_id}`, {
                    method: "POST",
                    headers: {
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    },
                    
                    // body: JSON.stringify({
                    //     "grp_nom": this.new_groups_nom,
                    //     "grp_apprs": this.new_groups_apprs
                    // })
                })
                .then( (response) => {
                    this.clearMessages()
                    if ((response.status > 200 && response.status < 300) || response.status ==400) {
                        return new Promise((resolve) => response.json()
                        .then((result) => resolve({
                            status: response.status,
                            result,
                        })));
                    } else {
                        throw Error(respose.statusText);
                    }
                })
                .then(({status, result}) => {
                    console.log("Result:", result)
                    console.log("Status:", status)
                    if (status == 400){
                        for (const [key, value] of Object.entries(result)) {
                            this.messages.push(`${key}: ${value}`)
                        }
                        this.msg_class ="err_msg"
                    } else {
                        this.messages.push(`Groupes pour le brief ${result.brief_id} créés`)
                        this.msg_class = "succes_msg"
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },
        show(brief_id) {
            console.log(`Will display brief #${brief_id} update form`)
            this.briefs.forEach(brief => {
                console.log(`f_update_${brief.id}`)
                this.$refs[`f_update_${brief.id}`][0].style.display = 'none'
                if (brief.id == brief_id){
                    this.cur_brief_title = brief.brief_title
                    this.cur_brief_url = brief.brief_url
                    this.cur_brief_nb_apprs = brief.brief_nb_apprs
                }
            });
            this.$refs[`f_update_${brief_id}`][0].style.display = 'block'
        },

        async regenerateGroups(brief_id) {
            fetch(`http://127.0.0.1:8000/api/briefs/gen_groups/${brief_id}`, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //make sure to serialize your JSON body
            body: JSON.stringify({"force": true})
            })

        .then(({status, result}) => {
            // console.log("groupes: ", this.brief.groups)
            console.log("title: ", this.briefs.brief_title)
            console.log("Status: ", status)
            if (status == 400){
                for (const [key, value] of Object.entries(result)) {
                    this.messages.push(`Erreur pour le champ ${key}: ${value}`)
                }
                this.msg_class = "err_msg"
            } else {  // 200
                this.messages.push('Groupes recréés avec succès!')
                this.msg_class = "succes_msg"
                this.fetchBrief()
            }
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            },

    },
    mounted() {
        this.fetchBriefs()
    }
}
</script>



<template>
    <v-btn icon @click="add_brief = !add_brief"><v-icon>mdi-plus-box-outline</v-icon></v-btn>
    <div v-show="add_brief">
        <form @submit.prevent="addBrief">
            <label for="title">Titre</label>
            <input name="title" v-model="new_brief_title">
            <label for="url">URL</label>
            <input name="url" v-model="new_brief_url">
            <label for="nb_appr">Nb_appr</label>
            <input name="nb_appr" v-model="new_brief_nb_apprs">
            <button>Ajouter</button>
        </form>
    </div>
    <ul :class="msg_class" v-for="message in this.messages">
        <li>{{ message }}</li>
    </ul>
    <p v-if="!briefs">Chargement...</p>
    <div v-else>
        <ul v-for="brief in this.briefs">
            <v-card class="mx-auto" max-width=70%>
            <li>
                <ul>
                    <li class="text-center">{{ brief.brief_title }}</li>
                    <li class="text-center">{{ brief.brief_url }}</li>
                    <li class="text-center">Taille d'un nôme : {{ brief.brief_nb_apprs }}</li>
                </ul> 
                <div v-if="(brief.groups.length == 0)">
                    <a href='#' @click="createGroups(brief.id)"></a>
                </div>
                <div v-else>
                    <div v-show="voir_groups">
                        <ul v-for="group in brief.groups">  
                            <li class="text-center">{{ group.grp_nom }}</li>
                            <ul v-for="binome in group.grp_apprs">
                                <li class="text-center"> {{ binome.appr_nom }} {{ binome.appr_prenom }}</li>
                            </ul>
                        </ul> 
                    </div>
                </div>
                <v-card-actions class="justify-center"> 
                            <v-flex>
                                <v-btn elevation="3" icon color="teal-accent-4" @click="(show(brief.id))">
                                    <v-icon>mdi-pencil</v-icon> 
                                </v-btn> 
                                <v-btn elevation="3" icon fab color="red" @click="deleteBrief(brief.id)">
                                    <v-icon>mdi-delete</v-icon> 
                                </v-btn>
                                <v-btn v-if="(brief.groups.length != 0)" elevation="3" icon fab color="yellow" @click="(voir_groups = !voir_groups)">
                                    <v-icon>mdi-account-multiple-outline</v-icon> 
                                </v-btn>
                                <v-btn v-if="(brief.groups.length != 0 && voir_groups)" elevation="3" icon fab color="black" @click="regenerateGroups(brief.id)">
                                    <v-icon>mdi-replay</v-icon>
                                </v-btn>
                                <v-btn v-show="(brief.groups.length == 0)" elevation="3" icon fab color="black" @click="createGroups(brief.id)">
                                    <v-icon >mdi-account-multiple-plus</v-icon>
                                </v-btn>
                            </v-flex>    
                        </v-card-actions>       
                <form style="display: none;" :ref="'f_update_' + brief.id" @submit.prevent="updateBrief(brief.id)">
                    <label for="title">Title:  </label>
                    <input name="title" v-model="cur_brief_title">
                    <label for="url"> URL: </label>
                    <input name="url" v-model="cur_brief_url">
                    <label for="nb_appr"> Nombre d'apprenants: </label>
                    <input name="nb_appr" v-model="cur_brief_nb_apprs">                     
                    <button>Mettre à jour</button>
                </form>
            </li>
            </v-card>
            <br>
        </ul>
    </div>
</template>

<style>
ul {
    list-style: none;
}
.err_msg {
    color: red;
}
.succes_msg {
    color: green;
}
</style>