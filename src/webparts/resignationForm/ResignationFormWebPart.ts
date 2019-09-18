import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-webpart-base';
import * as strings from 'ResignationFormWebPartStrings';
import ResignationDashboard from './components/ResignationDashboard';
import { sp } from "@pnp/sp";
export interface IResignationFormWebPartProps {
  wpContext: any;
}

export default class ResignationFormWebPart extends BaseClientSideWebPart<IResignationFormWebPartProps> {
  public wpContext: any;
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
        wpContext : this.context
      } 
    );

    ReactDom.render(element, this.domElement, this.wpContext);
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
