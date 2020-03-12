import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext, IPropertyPaneDropdownOption, PropertyPaneTextField, PropertyPaneDropdown } from '@microsoft/sp-webpart-base';
import * as strings from 'ResignationFormWebPartStrings';
import Navigation from './components/Navigation';
import { sp } from "@pnp/sp";
import { update, get } from '@microsoft/sp-lodash-subset';
import { IResignationFormProps } from './components/Resignations/IResignationFormProps';

export default class ResignationFormWebPart extends BaseClientSideWebPart<IResignationFormProps> {

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context,
        
      });
    });

  }
  public render(): void {
    const element: React.ReactElement<IResignationFormProps> = React.createElement(
      Navigation,
      {
        context: this.context
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
            description: "Resignation"
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: "Description"
                }),
                PropertyPaneTextField('name', {
                  label: "Title",
                  
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
