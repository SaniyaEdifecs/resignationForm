import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneDropdown } from '@microsoft/sp-webpart-base';
import * as strings from 'ResignationFormWebPartStrings';
import ResignationDashboard from './components/ResignationDashboard';
import { sp } from "@pnp/sp";
export interface IResignationFormWebPartProps {
  description: string;
  test2: string;
 
}

export default class ResignationFormWebPart extends BaseClientSideWebPart<IResignationFormWebPartProps> {
  public cntext: any;
  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }
  public render(): void {
    
    const element: React.ReactElement<IResignationFormWebPartProps> = React.createElement(
      ResignationDashboard,
      {
        context : this.context
      } 
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
             
                PropertyPaneDropdown('test2', {
                  label: 'Dropdown',
                  options: [
                    { key: '1', text: 'One' },
                    { key: '2', text: 'Two' },
                    { key: '3', text: 'Three' },
                    { key: '4', text: 'Four' }
                  ]}
                ),
               
              ]
            }
          ]
        }
      ]
    };
  }
}
