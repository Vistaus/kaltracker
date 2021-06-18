/*
 * 2021  Ivo Xavier
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
import Ubuntu.Components 1.3
import Ubuntu.Components.Popups 1.3
import "../js/DataBaseTools.js" as DataBase

Dialog {
       id: aboutApp
       title: i18n.tr("Kaltracker version " + root.appVersion)

        Label{
            text: i18n.tr("")
        }
        
        Button {
            text: "Back"
            onClicked:{
                PopupUtils.close(aboutApp)
            } 
        }
    

        
}