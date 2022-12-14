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
//import QtQuick.Controls 2.2
import QtQuick.Layouts 1.3
import Qt.labs.settings 1.0
import Lomiri.Components.ListItems 1.3 
import Lomiri.Components.Popups 1.3
import QtCharts 2.3
import QtQuick.Controls.Suru 2.2
import QtQuick.LocalStorage 2.12
import "components"



Page{
    id: set_age_page
    objectName: 'SetAgePage'
    header: PageHeader {
        visible: true
        title: i18n.tr("About You")

        StyleHints {
           /* foregroundColor: "white"
            backgroundColor:  Suru.theme === 0 ? ThemeColors.utFoods_blue_theme_background : ThemeColors.utFoods_dark_theme_background */
        }
    }
    
    //enables the next button after user clicking in one slotAge
    property bool is_age_inputed : false

    Rectangle{
        anchors{
            top: parent.header.bottom
            left : parent.left
            right : parent.right
            bottom : parent.bottom
        }
        color : Suru.theme === 0 ? root.kaltracker_light_theme.background : root.kaltracker_dark_theme.background
    }

    Flickable {

        anchors{
            top: parent.header.bottom
            left: parent.left
            right: parent.right
            bottom: parent.bottom
        }

        contentWidth: parent.width
        contentHeight: main_column.height  

        interactive : root.height > root.width ? false : true
        
        ColumnLayout{
            id: main_column
            width: root.width

            CompletationBar{
                Layout.alignment: Qt.AlignCenter
                Layout.preferredWidth: root.width - units.gu(9)
                value: 66
            }

            BlankSpace{height:units.gu(2)}

            Text{
                Layout.alignment: Qt.AlignCenter   
                text: i18n.tr("What's Your Age?")
                font.pixelSize: units.gu(4)
                color : Suru.theme === 0 ? root.kaltracker_light_theme.text_color : root.kaltracker_dark_theme.text_color
            }

            BlankSpace{height:units.gu(2)}

            SlotAge{
                Layout.alignment: Qt.AlignCenter
                Layout.preferredWidth: root.width - units.gu(9)
                placeholderText: i18n.tr("Enter Your Age In Years")
                color : "transparent"
            }

            BlankSpace{height:units.gu(8)}
          
            Text{
                Layout.alignment: Qt.AlignCenter    
                text: i18n.tr("You Can Change It Later") + " 😎."
                font.pixelSize: units.gu(1.5)
                color : Suru.theme === 0 ? root.kaltracker_light_theme.text_color : root.kaltracker_dark_theme.text_color 
            }

            BlankSpace{height:units.gu(20)}

            Button{
                Layout.alignment: Qt.AlignCenter 
                text: i18n.tr("Next")
                enabled: set_age_page.is_age_inputed
                color : LomiriColors.green
                onClicked:{
                    page_stack.push(set_weight_page)
                }    
            }
        }  
    }
}