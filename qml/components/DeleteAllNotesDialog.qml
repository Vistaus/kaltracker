/*
 * 2022  Ivo Xavier 
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * kaltracker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


import QtQuick 2.9
import Lomiri.Components 1.3
import Lomiri.Components.Popups 1.3
import Lomiri.Components.Pickers 1.3
import QtQuick.LocalStorage 2.12
import "../../js/NotesTable.js" as  NotesTable



Dialog { 
    id: delete_notes_dialog
    
    property int confirmed

    title: i18n.tr("Delete Notes")   

    Text {
        id: confirm_delete_code
        width: units.gu(12)
        text: i18n.tr("Confirm Operation With: YES")
    } 


    ConfirmPicker{onSelectedIndexChanged: confirmed = selectedIndex}

    Label{id: operation_label; color: LomiriColors.red}
    
    Button{
        id: delete_button
        text: i18n.tr("Delete")
        color: LomiriColors.red
        onClicked:{
            if(confirmed == 2){
                NotesTable.deleteAllNotes()
                root.initDB()
                PopupUtils.close(delete_notes_dialog)
                PopupUtils.open(operation_result_popover)

            }else{
                operation_label.text = i18n.tr("Wrong Answer, Try Again")
            }
        }
    }  

    Button{
        text: i18n.tr("Cancel")
        color: LomiriColors.green
        onClicked:{
            PopupUtils.close(delete_notes_dialog)
        }
    }        
}
        

